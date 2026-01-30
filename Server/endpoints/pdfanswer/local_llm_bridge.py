import os
import json
import torch
import sys

def find_phi3_cache():
    # Try multiple common locations for the cache
    possible_bases = [
        os.path.expanduser("~/.cache/huggingface/hub"),
        r"C:\Users\yashk\.cache\huggingface\hub"
    ]
    target = "models--microsoft--Phi-3-mini-4k-instruct"
    
    for base in possible_bases:
        model_dir = os.path.join(base, target, "snapshots")
        if os.path.exists(model_dir):
            snapshots = os.listdir(model_dir)
            if snapshots:
                return os.path.join(model_dir, snapshots[0])
    return None

def generate_local_response(prompt, max_tokens=256):
    try:
        from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
        
        snapshot_path = find_phi3_cache()
        model_id = snapshot_path if snapshot_path else "microsoft/Phi-3-mini-4k-instruct"
        
        print(f"Initializing Spark.E Brain from: {model_id}", file=sys.stderr)
        
        tokenizer = AutoTokenizer.from_pretrained(
            model_id, 
            trust_remote_code=True,
            local_files_only=True if snapshot_path else False
        )
        
        # Load with minimal complex features to avoid attribute errors
        model = AutoModelForCausalLM.from_pretrained(
            model_id,
            torch_dtype=torch.float32, 
            device_map="cpu",
            trust_remote_code=True,
            local_files_only=True if snapshot_path else False,
            low_cpu_mem_usage=True,
            # This is the critical line for the 'seen_tokens' bug in Phi-3
            attn_implementation="eager" 
        )

        messages = [
            {"role": "system", "content": "You are Spark.E, a helpful and scientific AI tutor."},
            {"role": "user", "content": prompt}
        ]
        
        # Use the pipeline for more robust generation if chat template fails
        try:
            pipe = pipeline(
                "text-generation",
                model=model,
                tokenizer=tokenizer,
            )
            
            output = pipe(messages, max_new_tokens=max_tokens, temperature=0.7, do_sample=True, top_p=0.9)
            response = output[0]['generated_text'][-1]['content']
            return {"success": True, "response": response.strip()}
        except Exception as pipe_err:
            print(f"Pipeline failed, falling back: {pipe_err}", file=sys.stderr)
            # Fallback manual generation
            prompt_text = f"<|system|>\nYou are Spark.E, a helpful and scientific AI tutor.<|end|>\n<|user|>\n{prompt}<|end|>\n<|assistant|>\n"
            inputs = tokenizer(prompt_text, return_tensors="pt").to(model.device)
            
            with torch.no_grad():
                outputs = model.generate(
                    **inputs,
                    max_new_tokens=max_tokens,
                    do_sample=True,
                    temperature=0.7,
                    use_cache=False, # DISABLING CACHE TO FIX SEEN_TOKENS BUG
                    pad_token_id=tokenizer.eos_token_id
                )
            response = tokenizer.decode(outputs[0][inputs['input_ids'].shape[-1]:], skip_special_tokens=True)
            return {"success": True, "response": response.strip()}

    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No prompt provided"}))
        sys.exit(1)

    user_prompt = sys.argv[1]
    result = generate_local_response(user_prompt)
    print(json.dumps(result))
