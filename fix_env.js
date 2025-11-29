const fs = require('fs');
const content = `PORT=3000
N8N_WEBHOOK_BASE_URL=http://localhost:5678/webhook
API_KEY=dev_key
`;
fs.writeFileSync('.env', content, 'utf8');
console.log('.env created');
