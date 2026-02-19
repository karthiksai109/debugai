import OpenAI from 'openai';
import { ANALYSIS_SYSTEM_PROMPT } from '../prompts/system.js';

let client;

export function initAI() {
  client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export async function analyzeInput(inputText) {
  if (!client) initAI();

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
      { role: 'user', content: inputText }
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content;
  const parsed = JSON.parse(content);

  const required = ['severity', 'category', 'root_cause', 'suggestion', 'confidence'];
  for (const field of required) {
    if (!(field in parsed)) {
      throw new Error(`AI response missing required field: ${field}`);
    }
  }

  return {
    severity: parsed.severity,
    category: parsed.category,
    root_cause: parsed.root_cause,
    suggestion: parsed.suggestion,
    code_fix: parsed.code_fix || '',
    confidence: parsed.confidence
  };
}
