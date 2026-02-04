import axios from 'axios';

const API_URL = 'http://localhost:3005';

async function testChatEndpoint() {
    console.log('🧪 Testing /tutor/chat endpoint...');

    try {
        const formData = new FormData();
        formData.append('message', 'Hello, test message');
        formData.append('personality', 'friendly');
        formData.append('depth', 'standard');
        formData.append('language', 'en');

        const response = await axios.post(`${API_URL}/tutor/chat`, formData, {
            timeout: 10000
        });

        console.log('✅ SUCCESS:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ FAILED:', error.message);
        console.error('Error name:', error.name);
        console.error('Error code:', error.code);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error('No response received. Request was made but no response.');
        }
        console.error('Full error:', error);
    }
}

testChatEndpoint();
