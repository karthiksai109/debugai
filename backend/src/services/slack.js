import pkg from '@slack/bolt';
const { App } = pkg;
import { v4 as uuidv4 } from 'uuid';
import { analyzeInput } from './ai.js';
import { insertAnalysis, updateAnalysisResult, markAnalysisFailed } from './db.js';
import { SLACK_RESPONSE_TEMPLATE } from '../prompts/system.js';

let slackApp;

function hasValidSlackCreds() {
  const bot = process.env.SLACK_BOT_TOKEN || '';
  const secret = process.env.SLACK_SIGNING_SECRET || '';
  const appToken = process.env.SLACK_APP_TOKEN || '';
  if (bot.includes('your-') || secret.includes('your-') || appToken.includes('your-')) return false;
  return bot.startsWith('xoxb-') && secret.length > 10 && appToken.startsWith('xapp-');
}

export function initSlack() {
  if (!hasValidSlackCreds()) {
    console.log('[slack] Missing or placeholder Slack credentials, bot disabled');
    return null;
  }

  slackApp = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true
  });

  slackApp.message(async ({ message, say }) => {
    if (message.subtype) return;

    const id = uuidv4();
    const inputText = message.text;

    try {
      insertAnalysis({
        id,
        source: 'slack',
        channel_id: message.channel,
        user_id: message.user,
        user_name: message.user,
        input_text: inputText
      });

      await say({ text: ':hourglass_flowing_sand: Analyzing your input...', thread_ts: message.ts });

      const result = await analyzeInput(inputText);

      updateAnalysisResult({ id, ...result });

      await say({ text: SLACK_RESPONSE_TEMPLATE(result), thread_ts: message.ts });
    } catch (err) {
      console.error('[slack] Analysis failed:', err.message);
      markAnalysisFailed(id, err.message);
      await say({ text: `:x: Analysis failed: ${err.message}`, thread_ts: message.ts });
    }
  });

  slackApp.command('/debug', async ({ command, ack, respond }) => {
    await ack();

    const id = uuidv4();
    const inputText = command.text;

    if (!inputText.trim()) {
      await respond('Usage: `/debug <paste your error log or describe the issue>`');
      return;
    }

    try {
      insertAnalysis({
        id,
        source: 'slack_command',
        channel_id: command.channel_id,
        user_id: command.user_id,
        user_name: command.user_name,
        input_text: inputText
      });

      await respond(':hourglass_flowing_sand: Analyzing...');

      const result = await analyzeInput(inputText);
      updateAnalysisResult({ id, ...result });

      await respond(SLACK_RESPONSE_TEMPLATE(result));
    } catch (err) {
      console.error('[slack] Command analysis failed:', err.message);
      markAnalysisFailed(id, err.message);
      await respond(`:x: Analysis failed: ${err.message}`);
    }
  });

  return slackApp;
}

export async function startSlack() {
  if (!slackApp) return;
  await slackApp.start();
  console.log('[slack] Bot connected via Socket Mode');
}
