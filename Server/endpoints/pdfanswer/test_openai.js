import OpenAI from 'openai';
import { config } from 'dotenv';
import path from 'path';

// Force reload env
config({ path: path.join(process.cwd(), '.env'), override: true });

async function testApiKey() {
    console.log('--- OpenAI API Key Diagnostic (v2) ---');
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        console.error('ERROR: OPENAI_API_KEY is not defined in .env');
        return;
    }

    console.log(`Key length: ${apiKey.length}`);
    console.log(`Key prefix: ${apiKey.substring(0, 10)}...`);

    // Check for weird characters
    if (apiKey.includes('"') || apiKey.includes("'")) {
        console.warn('WARNING: Your key contains quotes, this might be the issue.');
    }

    const openai = new OpenAI({ apiKey: apiKey.trim() });

    try {
        console.log('Testing connection to OpenAI...');
        const models = await openai.models.list();
        console.log('SUCCESS: API key is valid.');
        console.log(`Available models: ${models.data.slice(0, 3).map(m => m.id).join(', ')}`);

    } catch (error) {
        console.error('--- DIAGNOSTIC ERROR ---');
        console.error(`Status: ${error.status}`);
        console.error(`Message: ${error.message}`);

        if (error.status === 401) {
            console.error('ACTION: The key is still rejected as "Incorrect".');
        }
    }
}

testApiKey();
