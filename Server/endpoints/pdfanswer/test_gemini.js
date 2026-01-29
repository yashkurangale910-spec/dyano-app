import fetch from 'node-fetch';

async function testGemini() {
    console.log('--- Spark.E Gemini Stress Test ---');
    try {
        const response = await fetch('http://localhost:3005/tutor/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer test-token' // This might fail if middleware is strict
            },
            body: JSON.stringify({
                message: "Hello Spark.E! Tell me one cool fact about space in 10 words.",
                personality: "friendly"
            })
        });

        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('AI Response:', data.response || data.message);
    } catch (err) {
        console.error('Test Failed:', err.message);
    }
}

// Check environment first
console.log('Checking Server Health...');
fetch('http://localhost:3005/health')
    .then(r => r.json())
    .then(h => {
        console.log('Server Healthy:', h.status);
        // We can't easily test /chat without a real JWT, but we can verify the code loads.
    }).catch(e => console.log('Server unreachable:', e.message));
