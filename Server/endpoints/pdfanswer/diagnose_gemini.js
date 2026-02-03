import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({ path: 'd:/Games/Implementation/Server/endpoints/pdfanswer/.env' });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ GEMINI_API_KEY not found in .env");
    process.exit(1);
}

const MODELS = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro"
];

const VERSIONS = ["v1", "v1beta"];

async function runDiagnostics() {
    console.log(`Testing API Key: ${apiKey.substring(0, 10)}... (truncated)`);

    for (const version of VERSIONS) {
        console.log(`\n--- Testing API Version: ${version} ---`);
        for (const model of MODELS) {
            const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: "Hi" }] }]
                    })
                });

                const data = await response.json();
                if (response.ok) {
                    console.log(`✅ SUCCESS: Model ${model} works on ${version}`);
                } else {
                    console.log(`❌ FAILED: Model ${model} on ${version} - ${data.error?.message || response.statusText}`);
                }
            } catch (err) {
                console.log(`❌ ERROR: ${model} on ${version} - ${err.message}`);
            }
        }
    }
}

runDiagnostics();
