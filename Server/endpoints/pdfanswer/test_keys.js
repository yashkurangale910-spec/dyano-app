import fetch from 'node-fetch';

const keys = [
    "AIzaSyAP5Cvbg-0RvBFAmJjliDAhnmZ5h6BIgU0", // From .env
    "AIzaSyAu_oU789M8H5jDL4s_Wia833DFN4oezpM"  // From test_gemini_key.js
];

async function testKey(key) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
    const body = {
        contents: [{ role: "user", parts: [{ text: "Hello" }] }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        console.log(`Key: ${key.substring(0, 10)}...`);
        console.log(`Status: ${response.status}`);
        if (response.ok) {
            console.log(`✅ Success: ${data.candidates[0].content.parts[0].text}`);
        } else {
            console.log(`❌ Error: ${data.error?.message || JSON.stringify(data)}`);
        }
    } catch (e) {
        console.log(`❌ Network Error: ${e.message}`);
    }
    console.log('---');
}

async function runTests() {
    for (const key of keys) {
        await testKey(key);
    }
}

runTests();
