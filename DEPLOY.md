# Deployment Guide

## Frontend (DONE)

Live at https://debugai-dashboard.netlify.app

To redeploy after changes:
```
cd frontend
npm run build
npx netlify-cli deploy --dir=dist --prod
```

## Backend on Render

1. Go to https://dashboard.render.com
2. Click New > Web Service
3. Connect your GitHub repo: karthiksai109/debugai
4. Set Root Directory to: backend
5. Settings:
   - Name: debugai-backend
   - Runtime: Node
   - Build Command: npm install
   - Start Command: node src/index.js
6. Add Environment Variables:
   - OPENAI_API_KEY = your key from https://platform.openai.com/api-keys
   - SLACK_BOT_TOKEN = your xoxb- token
   - SLACK_SIGNING_SECRET = from Slack app Basic Information
   - SLACK_APP_TOKEN = your xapp- token
   - PORT = 10000 (Render uses this)
7. Click Create Web Service

Render will give you a URL like https://debugai-backend-xxxx.onrender.com

## Connect Frontend to Backend

After Render gives you the backend URL, redeploy the frontend with the API URL:

```
cd frontend
```

Create a .env file:
```
VITE_API_URL=https://debugai-backend-xxxx.onrender.com
```

Then rebuild and deploy:
```
npm run build
npx netlify-cli deploy --dir=dist --prod
```

## Slack App Setup

1. Go to https://api.slack.com/apps
2. Create New App > From Scratch
3. Name: DebugAI, pick your workspace
4. Go to Socket Mode > Enable (creates xapp- App Token)
5. Go to OAuth & Permissions > Bot Token Scopes, add:
   - chat:write
   - commands
   - im:history
   - im:read
   - im:write
6. Install App to Workspace (creates xoxb- Bot Token)
7. Copy Signing Secret from Basic Information
8. Optional: Slash Commands > Create /debug command
9. Go to Event Subscriptions > Subscribe to bot events:
   - message.im
10. Put all tokens in Render environment variables
