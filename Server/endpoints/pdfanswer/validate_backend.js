import fetch from 'node-fetch';

const API_URL = 'http://localhost:3005';

async function validateBackend() {
    console.log(`🚀 Starting Backend Validation at ${API_URL}...`);

    try {
        // 1. Health Check
        console.log('\nTesting /health endpoint...');
        const healthRes = await fetch(`${API_URL}/health`);
        if (healthRes.ok) {
            const healthData = await healthRes.json();
            console.log('✅ Health Check PASSED');
            console.log(`   Status: ${healthData.status}`);
            console.log(`   Uptime: ${healthData.uptime.toFixed(2)}s`);
        } else {
            console.error(`❌ Health Check FAILED: ${healthRes.statusText}`);
            process.exit(1);
        }

        // 2. Auth Endpoint (Check if it listens)
        console.log('\nTesting /auth endpoint availability...');
        // Sending a dummy request just to see if the route is registered (404 means route missing, 405/400/401 means route exists)
        const authRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST', // Missing body, so expect 400 or 422, but not 404
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}) // Empty body
        });

        if (authRes.status !== 404) {
            console.log(`✅ Auth Route Detected (Response: ${authRes.status})`);
        } else {
            console.error('❌ Auth Route NOT Found (404)');
            process.exit(1);
        }

        console.log('\n🎉 ALL VALIDATION CHECKS PASSED!');
        console.log('Backend is running and connected.');

    } catch (error) {
        console.error('\n❌ VALIDATION FAILED: Connection Error');
        console.error(error.message);
        process.exit(1);
    }
}

validateBackend();
