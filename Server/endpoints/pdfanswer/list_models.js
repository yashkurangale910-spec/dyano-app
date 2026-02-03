import fetch from 'node-fetch';
const apiKey = 'AIzaSyBq3siHB7tr1_rzncFzDUgtAiErNsLwvaQ';
async function test() {
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.models) {
            console.log('Available Models:', data.models.map(m => m.name).join(', '));
        } else {
            console.log('Error Listing Models:', JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error(e);
    }
}
test();
