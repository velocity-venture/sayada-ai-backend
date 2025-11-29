const axios = require('axios');

const endpoints = [
    // Tier 1
    { url: 'http://localhost:3000/api/inbox/process', data: { subject: 'Test' } },
    { url: 'http://localhost:3000/api/calendar/optimize', data: { calendarId: 'primary' } },
    { url: 'http://localhost:3000/api/meetings/transcribe', data: { audioUrl: 'http://test.com' } },
    { url: 'http://localhost:3000/api/calls/missed', data: { from: '+123' } },
    { url: 'http://localhost:3000/api/faq/ask', data: { question: 'Hi' } },
    // Tier 2
    { url: 'http://localhost:3000/api/social/post', data: { content: 'Hello' } },
    { url: 'http://localhost:3000/api/reviews/monitor', data: { reviewText: 'Good' } },
    { url: 'http://localhost:3000/api/finance/chase-invoices', data: { daysOverdue: 7 } },
    { url: 'http://localhost:3000/api/onboarding/start', data: { email: 'test@test.com' } },
    { url: 'http://localhost:3000/api/finance/expenses', data: { receiptText: 'Lunch' } },
    { url: 'http://localhost:3000/api/inventory/check', data: { stockLevel: 5 } },
    { url: 'http://localhost:3000/api/leads/qualify', data: { leadData: {} } }
];

async function runTests() {
    for (const ep of endpoints) {
        try {
            const res = await axios.post(ep.url, ep.data);
            console.log(`✅ ${ep.url} - Status: ${res.status}, Data:`, res.data);
        } catch (err) {
            console.error(`❌ ${ep.url} - Failed:`, err.message);
            if (err.response) {
                console.error('Response:', err.response.data);
            } else {
                console.error('Error details:', err);
            }
        }
    }
}

runTests();
