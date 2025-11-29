const axios = require('axios');

const endpoints = [
    { url: 'http://localhost:3000/api/inbox/process', data: { subject: 'Test' } },
    { url: 'http://localhost:3000/api/calendar/optimize', data: { calendarId: 'primary' } },
    { url: 'http://localhost:3000/api/meetings/transcribe', data: { audioUrl: 'http://test.com' } },
    { url: 'http://localhost:3000/api/calls/missed', data: { from: '+123' } },
    { url: 'http://localhost:3000/api/faq/ask', data: { question: 'Hi' } }
];

async function runTests() {
    for (const ep of endpoints) {
        try {
            const res = await axios.post(ep.url, ep.data);
            console.log(`✅ ${ep.url} - Status: ${res.status}, Data:`, res.data);
        } catch (err) {
            console.error(`❌ ${ep.url} - Failed:`, err.message);
            if (err.response) console.error('Response:', err.response.data);
        }
    }
}

runTests();
