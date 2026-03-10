// promptBuilder.js
function buildPrompt(userAction, rules) {
  const rulesText = rules
    .map((r, i) => `${i + 1}. ${r.rule_text} (${r.type})`)
    .join("\n");

  return `
You are a strict but fair personal rules advisor. 
Judge the user action against these rules. Quote rules when relevant. Grade severity.

Rules:
${rulesText}

User action: ${userAction}

Respond only in JSON with fields:
{
  "judgment": "short verdict, e.g., 'Stop, this is against a high rule.'",
  "violations": ["list of rules broken or triggered"],
  "explanation": "brief explanation of why the action violates rules",
  "reflection_prompt": "short question to reflect on your action"
}
`;
}

module.exports = { buildPrompt };
