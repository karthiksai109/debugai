import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDB } from './services/db.js';
import { initAI } from './services/ai.js';
import { initSlack, startSlack } from './services/slack.js';
import healthRouter from './routes/health.js';
import analysisRouter from './routes/analysis.js';
import { errorHandler, notFound } from './middleware/errors.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/api', healthRouter);
app.use('/api', analysisRouter);
app.use(notFound);
app.use(errorHandler);

async function start() {
  console.log('[db] Initializing database...');
  initDB();

  if (process.env.OPENAI_API_KEY) {
    console.log('[ai] Initializing OpenAI...');
    initAI();
  } else {
    console.log('[ai] OPENAI_API_KEY not set, AI analysis disabled');
  }

  initSlack();
  await startSlack();

  app.listen(PORT, () => {
    console.log(`[server] Running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('[fatal]', err);
  process.exit(1);
});
