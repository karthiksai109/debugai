# CLAUDE.md - DebugAI Backend Agent

## What This Is
DebugAI is an AI-powered backend debugging and optimization agent. Users send log snippets, error traces, or performance concerns through Slack. The agent analyzes them using OpenAI, identifies root causes, suggests fixes, and returns results back through Slack.

## Project Structure
Monorepo with two apps:
- `backend/` - Node.js Express API server. Handles Slack events, runs AI analysis, stores results.
- `frontend/` - React Vite dashboard. Shows analysis history, metrics, real-time status.

Each app has its own AGENTS.md with build/test/run instructions.

## Tech Stack
- Backend: Node.js 18+, Express, OpenAI SDK, Slack Bolt SDK, SQLite (better-sqlite3)
- Frontend: React 18, Vite, Tailwind CSS, Recharts
- No Docker required for local dev

## How to Run
```
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

## Environment Variables (backend/.env)
- OPENAI_API_KEY - required for AI analysis
- SLACK_BOT_TOKEN - required for Slack integration
- SLACK_SIGNING_SECRET - required for Slack event verification
- SLACK_APP_TOKEN - required for Socket Mode
- PORT - defaults to 3001

## Principles (Karpathy-inspired)
1. Think before coding. Surface tradeoffs, don't assume.
2. Simplicity first. Minimum code that solves the problem.
3. Surgical changes. Touch only what you must.
4. Goal-driven execution. Define success criteria, loop until verified.

## Do's
- Keep functions under 50 lines
- Use early returns
- Handle errors at the boundary, not everywhere
- Match existing code style

## Don'ts
- No speculative features
- No abstractions for single-use code
- No drive-by refactoring
- No changing comments or code you don't understand
