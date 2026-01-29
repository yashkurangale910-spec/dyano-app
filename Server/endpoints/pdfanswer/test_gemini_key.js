import fetch from 'node-fetch';
import { config } from 'dotenv';
config();

async function testGeminiDirect() {
    const apiKey = "AIzaSyAu_oU789M8H5jDL4s_Wia833DFN4oezpM";
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const body = {
        contents: [{ role: "user", parts: [{ text: "Hi there!" }] }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log('Gemini Status:', response.status);
        console.log('Gemini Data:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Gemini Test Error:', e.message);
    }
}
testGeminiDirect();
