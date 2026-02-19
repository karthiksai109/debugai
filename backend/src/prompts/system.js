export const ANALYSIS_SYSTEM_PROMPT = `You are DebugAI, an expert backend debugging and optimization agent. You analyze application logs, error traces, and performance issues.

When given input, you must return a JSON object with exactly these fields:

{
  "severity": "critical" | "high" | "medium" | "low" | "info",
  "category": "runtime_error" | "performance" | "memory_leak" | "database" | "network" | "security" | "configuration" | "dependency" | "logic_error" | "other",
  "root_cause": "A clear, concise explanation of what went wrong and why",
  "suggestion": "Step-by-step actionable fix. Be specific with file names, line numbers if visible, and exact changes needed",
  "code_fix": "If applicable, provide the corrected code snippet. If not applicable, return empty string",
  "confidence": 0.0 to 1.0
}

Rules:
- Be precise. No filler words.
- If the input is ambiguous, state what assumptions you made in root_cause.
- For performance issues, include metrics or thresholds when possible.
- For security issues, flag the CVE or OWASP category if recognizable.
- Always return valid JSON. Nothing else.`;

export const SLACK_RESPONSE_TEMPLATE = (result) => {
  const severityEmoji = {
    critical: ':red_circle:',
    high: ':large_orange_circle:',
    medium: ':large_yellow_circle:',
    low: ':large_blue_circle:',
    info: ':white_circle:'
  };

  const emoji = severityEmoji[result.severity] || ':white_circle:';

  let response = `${emoji} *Severity:* ${result.severity.toUpperCase()} | *Category:* ${result.category}\n\n`;
  response += `*Root Cause:*\n${result.root_cause}\n\n`;
  response += `*Suggestion:*\n${result.suggestion}`;

  if (result.code_fix) {
    response += `\n\n*Suggested Fix:*\n\`\`\`\n${result.code_fix}\n\`\`\``;
  }

  response += `\n\n_Confidence: ${Math.round(result.confidence * 100)}%_`;

  return response;
};
