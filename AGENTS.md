# AGENTS.md - DebugAI

## Project Overview
AI-powered backend debugging agent. Users interact via Slack, the agent analyzes logs/errors/performance issues using OpenAI, returns actionable fixes.

## Monorepo Layout
```
debugai/
  backend/    - Express API + Slack Bot + OpenAI + SQLite
  frontend/   - React dashboard (Vite + Tailwind)
```

## Quick Start
```
# Backend
cd backend && cp .env.example .env && npm install && npm run dev

# Frontend
cd frontend && npm install && npm run dev
```

## Required API Keys
- OPENAI_API_KEY from https://platform.openai.com
- SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN from https://api.slack.com/apps

## Testing
- Backend: `cd backend && npm test`
- Frontend: `cd frontend && npm run build` (type check + build)

## Code Conventions
- ES modules throughout (type: module in package.json)
- Async/await, no callbacks
- Error handling at route level with middleware
- SQLite for persistence, no ORM
- Environment variables via dotenv, never hardcoded
