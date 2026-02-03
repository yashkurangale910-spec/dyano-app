import dotenv from 'dotenv';
dotenv.config();

/**
 * Call Groq AI for Ultra-Fast Inference
 */
export async function callGroq(messages, options = {}) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error("GROQ_API_KEY not found in environment");
    }

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: options.model || "llama-3.3-70b-versatile",
                messages: messages,
                temperature: options.temperature || 0.7,
                max_tokens: options.max_tokens || 1024,
                response_format: options.response_format || { type: "text" }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || response.statusText);
        }

        return data.choices[0].message.content;
    } catch (error) {
        console.error("❌ Groq Error:", error.message);
        throw error;
    }
}
