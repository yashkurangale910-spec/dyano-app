import fetch from 'node-fetch';

async function runDiagnostics() {
    const API_URL = "http://localhost:3005";
    console.log("🔍 Probing Neural Hub at:", API_URL);

    // 1. Health Ping
    try {
        const health = await fetch(`${API_URL}/health`);
        console.log("✅ Health Check:", health.status, await health.text());
    } catch (e) {
        console.error("❌ Health Check Failed:", e.message);
    }

    // 2. Tutor Ping
    try {
        const tutorPing = await fetch(`${API_URL}/tutor/ping`);
        console.log("✅ Tutor Ping:", tutorPing.status, await tutorPing.text());
    } catch (e) {
        console.error("❌ Tutor Ping Failed:", e.message);
    }

    // 3. Tutor Chat (Anonymous)
    try {
        console.log("📡 Attempting Anonymous Chat...");
        const chat = await fetch(`${API_URL}/tutor/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: "Test Transmission: 1, 2, 3",
                personality: "friendly",
                depth: "standard"
            })
        });
        const chatData = await chat.json();
        console.log("✅ Chat Response:", chat.status, JSON.stringify(chatData).substring(0, 100) + "...");
    } catch (e) {
        console.error("❌ Chat Link Failed:", e.message);
    }

    // 4. Quiz Probe
    try {
        console.log("📡 Attempting Quiz Generation (Auth Required)...");
        const quiz = await fetch(`${API_URL}/quiz`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: "Neural Networks" })
        });
        const quizData = await quiz.json();
        console.log("✅ Quiz Probe:", quiz.status, quizData.message || quizData.error);
    } catch (e) {
        console.error("❌ Quiz Link Failed:", e.message);
    }
}

runDiagnostics();
