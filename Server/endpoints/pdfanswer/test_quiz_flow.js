import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = 'http://localhost:3005';
const JWT_SECRET = process.env.JWT_SECRET;
const TEST_USER_ID = 'test_debugger_user_123';

async function runTest() {
    console.log("🧪 Starting Quiz Integration Test...");

    if (!JWT_SECRET) {
        console.error("❌ CRTICAL: JWT_SECRET missing in .env");
        process.exit(1);
    }

    // 1. Generate Test Token
    const token = jwt.sign(
        { userId: TEST_USER_ID, email: 'test@debugger.com' },
        JWT_SECRET,
        { expiresIn: '1h' }
    );
    console.log("✅ Generated Test Token.");

    // 2. Call Quiz Endpoint
    console.log("🚀 Sending POST request to /quiz...");
    const payload = {
        prompt: "Operating Systems",
        difficulty: "medium",
        framework: "General"
    };

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_URL}/quiz`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });
        clearTimeout(timeout);

        console.log(`📡 Response Status: ${response.status} ${response.statusText}`);

        const text = await response.text();
        // Try parsing JSON
        try {
            const data = JSON.parse(text);
            if (!response.ok) {
                console.error("❌ API Error Response:", JSON.stringify(data, null, 2));
            } else {
                console.log("✅ SUCCESS! Quiz Generated:");
                console.log(`   Title: ${data.quiz.title}`);
                console.log(`   Questions: ${data.quiz.questions.length}`);
                console.log(`   First Q: ${data.quiz.questions[0].questionText}`);
            }
        } catch (e) {
            console.error("❌ Failed to parse JSON response:", text);
        }

    } catch (error) {
        console.error("🔥 Network/Fetch Error:", error.message);
    }
}

runTest();
