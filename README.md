# Sayada.ai Backend

Enterprise-Grade AI Business Automation Suite - Backend API.

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Configure environment:
    Copy `.env.example` to `.env` and update values.
    ```bash
    cp .env.example .env
    ```

3.  Run development server:
    ```bash
    npm run dev
    ```

## Tier 1 Automations - Curl Examples

### 1. Smart Inbox Management
```bash
curl -X POST http://localhost:3000/api/inbox/process \
  -H "Content-Type: application/json" \
  -d '{"subject": "Project Update", "content": "Here is the latest status report...", "from": "client@example.com"}'
```

### 2. Calendar Tetris
```bash
curl -X POST http://localhost:3000/api/calendar/optimize \
  -H "Content-Type: application/json" \
  -d '{"calendarId": "primary", "constraints": {"workHours": "9-5"}}'
```

### 3. Meeting Scribe
```bash
curl -X POST http://localhost:3000/api/meetings/transcribe \
  -H "Content-Type: application/json" \
  -d '{"audioUrl": "https://example.com/meeting.mp3", "meetingId": "123"}'
```

### 4. Missed Call Handler
```bash
curl -X POST http://localhost:3000/api/calls/missed \
  -H "Content-Type: application/json" \
  -d '{"from": "+15550199", "to": "+15550100", "timestamp": "2023-10-27T10:00:00Z"}'
```

### 5. FAQ Bot
```bash
curl -X POST http://localhost:3000/api/faq/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What are your business hours?"}'
```

## Tier 2 Automations - Curl Examples

### 6. Social Media Auto-Poster
```bash
curl -X POST http://localhost:3000/api/social/post \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello world!", "platforms": ["twitter", "linkedin"]}'
```

### 7. Review Management
```bash
curl -X POST http://localhost:3000/api/reviews/monitor \
  -H "Content-Type: application/json" \
  -d '{"reviewText": "Great service!", "rating": 5, "source": "google"}'
```

### 8. Invoice Chasing
```bash
curl -X POST http://localhost:3000/api/finance/chase-invoices \
  -H "Content-Type: application/json" \
  -d '{"daysOverdue": 7}'
```

### 9. Onboarding Flows
```bash
curl -X POST http://localhost:3000/api/onboarding/start \
  -H "Content-Type: application/json" \
  -d '{"email": "new.user@example.com", "name": "New User"}'
```

### 10. Expense Tracking
```bash
curl -X POST http://localhost:3000/api/finance/expenses \
  -H "Content-Type: application/json" \
  -d '{"receiptText": "Lunch $20", "category": "meals"}'
```

### 11. Inventory Alerts
```bash
curl -X POST http://localhost:3000/api/inventory/check \
  -H "Content-Type: application/json" \
  -d '{"itemId": "123", "stockLevel": 5}'
```

### 12. Lead Qualification
```bash
curl -X POST http://localhost:3000/api/leads/qualify \
  -H "Content-Type: application/json" \
  -d '{"leadData": {"name": "Lead", "score": 80}}'
```
