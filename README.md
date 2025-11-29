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
