import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Call OpenAI GPT-4o
 * Matches the signature of callGemini for easy replacement
 */
export async function callOpenAI(messages, options = {}) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        console.error("❌ CRITICAL: OPENAI_API_KEY is missing in process.env");
        throw new Error("OPENAI_API_KEY not found in environment");
    }

    const openai = new OpenAI({ apiKey });

    // Format messages for OpenAI
    // OpenAI supports 'system', 'user', 'assistant' roles directly.
    // We just need to handle images in the 'user' content array.
    const formattedMessages = messages.map(msg => {
        if (Array.isArray(msg.content)) {
            // Check for image content
            const content = msg.content.map(part => {
                if (part.type === 'text') return { type: 'text', text: part.text };
                if (part.type === 'image_url') {
                    // OpenAI expects { type: "image_url", image_url: { url: "..." } }
                    // Our internal format passed from tutor.js is usually { type: 'image_url', image_url: { url: ... } }
                    // which matches OpenAI's expectation if the URL is data URI or http link.
                    return { type: 'text', text: '[Image Uploaded]' }; // Placeholder if needed, but let's try direct map
                }
                return null;
            }).filter(Boolean);

            // Re-map properly for image handling if we want unrelated text + image
            // If the incoming msg.content has valid OpenAI structure, we use it.
            // But let's look at how `tutor.js` constructs it:
            // content: [ { type: 'text', text: ... }, { type: 'image_url', image_url: { url: ... } } ]
            // This is ALREADY compatible with OpenAI's format!
            return { role: msg.role, content: msg.content };
        }
        return { role: msg.role, content: msg.content };
    });

    const model = options.model || "gpt-4o";

    const config = {
        model: model,
        messages: formattedMessages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000,
    };

    if (options.response_format?.type === 'json_object') {
        config.response_format = { type: "json_object" };
    }

    try {
        const completion = await openai.chat.completions.create(config);

        if (completion.choices && completion.choices.length > 0) {
            return completion.choices[0].message.content;
        }

        throw new Error("No choices returned from OpenAI");

    } catch (error) {
        console.error("❌ OpenAI Error:", error.message);
        throw new Error(`OpenAI API failed: ${error.message}`);
    }
}
