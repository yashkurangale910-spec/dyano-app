import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

async function testGroq() {
    const apiKey = process.env.GROQ_API_KEY;
    console.log("Using API Key:", apiKey ? apiKey.substring(0, 5) + "..." : "MISSING");

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: "Hello, say 'Groq Link Stable'" }],
                max_tokens: 20
            })
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("❌ Groq Error:", data.error?.message || response.statusText);
        } else {
            console.log("✅ Groq Response:", data.choices[0].message.content);
        }
    } catch (error) {
        console.error("❌ Fetch Error:", error.message);
    }
}

testGroq();
