const ruleModel = require("../models/ruleModel");
const aiService = require("../services/aiService");
const { buildPrompt } = require("../utils/promptBuilder"); // Assuming you move it to utils

exports.evaluateAction = async (req, res) => {
  const { action } = req.body || {};

  // 1. Guard Clause
  if (!action?.trim()) {
    return res.status(400).json({ error: "Missing or invalid 'action' field" });
  }

  try {
    // 2. Fetch active rules from Model
    const rules = await ruleModel.getActiveRules();
    if (!rules?.length) {
      return res.status(400).json({ error: "No active rules found" });
    }

    // 3. Prepare AI Data
    const prompt = buildPrompt(action, rules);

    // 4. Call Service for AI Logic
    const aiResponse = await aiService.getAIJudgment(prompt);

    // 5. Transform/Clean Data
    const parsed = aiService.parseAIResponse(aiResponse);

    // 6. Enrich with DB details (Severity Notes)
    parsed.severityNotes = rules
      .filter((r) => r.type === "hard")
      .map((r) => r.rule_text);

    res.json(parsed);
  } catch (err) {
    console.error("Controller Error:", err);
    res
      .status(err.status || 500)
      .json({ error: err.message || "Evaluation failed" });
  }
};
