# How DebugAI Works - Complete Guide

## The Big Picture

You have a backend application that's throwing errors, running slow, or leaking memory. Instead of manually reading through logs and googling stack traces, you send the raw log to DebugAI through Slack. The AI agent reads it, figures out what went wrong, tells you the root cause, and gives you the exact fix. All results show up in a dashboard too.

## The Flow

1. You paste an error log or describe a performance issue in Slack (DM the bot or use /debug command)
2. Slack sends that message to our backend via Socket Mode (websocket, no public URL needed)
3. Backend saves the request to SQLite, then sends it to OpenAI GPT-4o with a carefully crafted system prompt
4. GPT-4o returns structured JSON with severity, category, root cause, suggestion, and code fix
5. Backend saves the result and sends a formatted response back to Slack
6. The React dashboard polls the backend and shows all analyses with charts and stats

## Why Each Piece Exists

**Slack Bot (Socket Mode)** - This is the user interface. Engineers already live in Slack. No new tool to learn. Socket Mode means no need to expose a public URL or deal with ngrok during development.

**OpenAI GPT-4o** - The brain. We use JSON mode (response_format: json_object) so the output is always parseable. Temperature is 0.2 for consistency. The system prompt is very specific about what fields to return and how to classify issues.

**SQLite** - Simple, zero-config persistence. No database server to run. The WAL mode makes it safe for concurrent reads. Good enough for a hackathon, easy to swap for Postgres later.

**Express API** - Serves the dashboard frontend and provides REST endpoints. The dashboard can also submit analyses directly without Slack.

**React Dashboard** - Visual overview. Shows severity distribution, category breakdown, confidence scores, and lets you drill into any analysis. Auto-refreshes every 10 seconds.

## The System Prompt

This is the most important part. The system prompt tells GPT-4o to act as a backend debugging expert and return exactly these fields:

- severity: critical/high/medium/low/info
- category: runtime_error/performance/memory_leak/database/network/security/configuration/dependency/logic_error/other
- root_cause: what went wrong and why
- suggestion: step-by-step fix
- code_fix: corrected code if applicable
- confidence: 0.0 to 1.0

The prompt is restrictive on purpose. No filler, no explanations outside the JSON, no hallucinated file paths. Just structured output.

## Sandbox / Security

- The AI agent only reads and analyzes. It never executes code or connects to your actual servers.
- Slack Bot Token has minimal scopes (chat:write, commands, im:history)
- OpenAI API key is in .env, never committed
- SQLite database is local, no external database connections
- CORS is configured, not wide open in production

## API Keys You Need

1. **OpenAI API Key** - Go to https://platform.openai.com/api-keys, create one. Costs about $0.01-0.03 per analysis with GPT-4o.

2. **Slack App** - Go to https://api.slack.com/apps
   - Create New App > From Scratch
   - Enable Socket Mode (generates App Token starting with xapp-)
   - Add Bot Token Scopes: chat:write, commands, im:history, im:read, im:write
   - Install to workspace (generates Bot Token starting with xoxb-)
   - Copy Signing Secret from Basic Information
   - Optional: Create /debug slash command under Slash Commands

3. That's it. No AWS, no Datadog, no infrastructure to set up.

## What Makes This Hackathon-Worthy

- Real problem that every backend engineer faces daily
- Working Slack integration (judges can try it live)
- AI does actual useful work, not just a wrapper around ChatGPT
- Structured output means results are consistent and actionable
- Dashboard gives a visual story for the presentation
- Clean codebase with proper CLAUDE.md/AGENTS.md conventions
- Can be extended to connect to real monitoring tools (Datadog, CloudWatch, PagerDuty)
