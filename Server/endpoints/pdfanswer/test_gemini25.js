import fetch from 'node-fetch';
import { config } from 'dotenv';
config();

async function testGemini25() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Testing with Key:', apiKey.substring(0, 8) + '...');
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const body = {
        contents: [{ role: "user", parts: [{ text: "Hi! Tell me a joke." }] }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log('Status:', response.status);
        if (data.candidates) {
            console.log('Response:', data.candidates[0].content.parts[0].text);
        } else {
            console.log('Error Data:', JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error('Test Error:', e.message);
    }
}
testGemini25();
