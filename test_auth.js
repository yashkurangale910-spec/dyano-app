async function testAuth() {
    const API_URL = 'http://localhost:3005';

    try {
        console.log('--- Auth Flow Test (Native Fetch) ---');

        // 1. Register
        console.log('1. Attempting Registration...');
        const registerRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'agent' + Date.now() + '@dyano.com',
                password: 'password123',
                name: 'Agent Test'
            })
        });
        const registerData = await registerRes.json();
        console.log('Register Success:', registerData.success);

        // 2. Login
        console.log('\n2. Attempting Login...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: registerData.data.user.email,
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        console.log('Login Success:', loginData.success);
        console.log('User:', loginData.data.user.name);

        // 3. Profile
        console.log('\n3. Verifying Profile with Token...');
        const profileRes = await fetch(`${API_URL}/auth/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${loginData.data.accessToken}`
            }
        });
        const profileData = await profileRes.json();
        console.log('Profile Success:', profileData.success);
        console.log('Verify User Name:', profileData.data.user.name);

        console.log('\n✅ AUTH FLOW VERIFIED SUCCESSFULLY!');
    } catch (error) {
        console.error('\n❌ AUTH FLOW TEST FAILED:', error.message);
    }
}

testAuth();
