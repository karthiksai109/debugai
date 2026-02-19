# AGENTS.md - DebugAI Backend

## What
Express API server with Slack Bot integration and OpenAI-powered log analysis.

## Stack
- Node.js 18+, ES modules
- Express for REST API
- @slack/bolt for Slack Socket Mode
- OpenAI SDK for GPT-4o analysis
- better-sqlite3 for local persistence
- No ORM, raw SQL

## File Map
```
src/
  index.js        - Entry point, starts Express + Slack bot
  routes/
    analysis.js   - REST endpoints for analysis CRUD
    health.js     - Health check endpoint
  services/
    ai.js         - OpenAI integration, prompt engineering
    slack.js      - Slack bot setup, event handlers
    db.js         - SQLite setup, queries
  middleware/
    errors.js     - Global error handler
  prompts/
    system.js     - System prompts for the AI agent
```

## Run
```
cp .env.example .env   # fill in keys
npm install
npm run dev            # starts on port 3001
```

## API Endpoints
- GET  /api/health
- GET  /api/analyses
- GET  /api/analyses/:id
- POST /api/analyses        (manual submission)
- GET  /api/analyses/stats  (dashboard metrics)

## Conventions
- Async/await everywhere
- Errors bubble to middleware, not caught inline
- DB initialized on startup with migrations in db.js
- All timestamps in ISO 8601 UTC
