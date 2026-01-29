import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

/**
 * Call Google Gemini AI
 */
export async function callGemini(messages, options = {}) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not found in environment");

    // Extract system instruction if it exists
    const systemMsg = messages.find(m => m.role === 'system');
    const systemInstruction = systemMsg ? { parts: [{ text: systemMsg.content }] } : undefined;

    // Filter out system message and convert roles
    const filteredMessages = messages.filter(m => m.role !== 'system');

    // Convert to Gemini-style contents and merge consecutive same roles
    const contents = [];
    for (const msg of filteredMessages) {
        const role = msg.role === 'assistant' ? 'model' : 'user';
        let parts = [];

        if (Array.isArray(msg.content)) {
            parts = msg.content.map(part => {
                if (part.type === 'text') return { text: part.text };
                if (part.type === 'image_url') {
                    const match = part.image_url.url.match(/^data:(image\/\w+);base64,(.+)$/);
                    if (match) return { inlineData: { mimeType: match[1], data: match[2] } };
                }
                return null;
            }).filter(Boolean);
        } else {
            parts = [{ text: msg.content }];
        }

        if (contents.length > 0 && contents[contents.length - 1].role === role) {
            contents[contents.length - 1].parts.push(...parts);
        } else {
            contents.push({ role, parts });
        }
    }

    const body = {
        contents,
        systemInstruction,
        generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.max_tokens || 1000,
            topP: 0.95,
            topK: 40,
        }
    };

    // Handle JSON mode if requested
    if (options.response_format?.type === 'json_object') {
        body.generationConfig.responseMimeType = "application/json";
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ Gemini API Error Details:", JSON.stringify(data, null, 2));
            throw new Error(data.error?.message || `Gemini API call failed with status ${response.status}`);
        }

        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }

        throw new Error("Invalid response structure from Gemini");
    } catch (err) {
        console.error("Gemini Helper Error:", err.message);
        throw err;
    }
}
