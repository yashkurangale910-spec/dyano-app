import dotenv from 'dotenv';
dotenv.config();

<<<<<<< HEAD
// List of models to try in order of preference
const MODELS = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-1.5-pro",
    "gemini-pro"
];

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/";

/**
 * Call Google Gemini AI with Fallback
 */
export async function callGemini(messages, options = {}) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ CRTICAL: GEMINI_API_KEY is missing in process.env");
        throw new Error("GEMINI_API_KEY not found in environment");
    }
=======
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

/**
 * Call Google Gemini AI
 */
export async function callGemini(messages, options = {}) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not found in environment");
>>>>>>> f37b43085a606618791e2462184fc2d00039b97c

    // Extract system instruction if it exists
    const systemMsg = messages.find(m => m.role === 'system');
    const systemInstruction = systemMsg ? { parts: [{ text: systemMsg.content }] } : undefined;

    // Filter out system message and convert roles
    const filteredMessages = messages.filter(m => m.role !== 'system');

<<<<<<< HEAD
    // Convert to Gemini-style contents
=======
    // Convert to Gemini-style contents and merge consecutive same roles
>>>>>>> f37b43085a606618791e2462184fc2d00039b97c
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

<<<<<<< HEAD
=======
    // Handle JSON mode if requested
>>>>>>> f37b43085a606618791e2462184fc2d00039b97c
    if (options.response_format?.type === 'json_object') {
        body.generationConfig.responseMimeType = "application/json";
    }

<<<<<<< HEAD
    // Try models in sequence
    let lastError = null;

    for (const model of MODELS) {
        try {
            // console.log(`Attempting Gemini connection with model: ${model}`); // Optional debug
            const url = `${BASE_URL}${model}:generateContent?key=${apiKey}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                // If it's a 404 (Not Found) or 400 (Bad Request), it might be the model.
                // We shouldn't retry on 429 (Quota) quickly, but for now we treat all errors as "try next"
                // except maybe invalid argument.
                const errorMsg = data.error?.message || response.statusText;
                // console.warn(`Model ${model} failed: ${errorMsg}`);

                // If specific error, throw immediately (e.g. invalid key)
                if (data.error?.status === 'INVALID_ARGUMENT' && errorMsg.includes('API_KEY')) {
                    throw new Error(errorMsg);
                }

                lastError = new Error(errorMsg);
                continue; // Try next model
            }

            if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                console.log(`✅ Success with model: ${model}`);
                return data.candidates[0].content.parts[0].text;
            }
        } catch (err) {
            lastError = err;
            // console.warn(`Network error with ${model}: ${err.message}`);
        }
    }

    console.error("❌ All Gemini models failed.");
    throw lastError || new Error("All Gemini models failed to respond.");
=======
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
>>>>>>> f37b43085a606618791e2462184fc2d00039b97c
}
