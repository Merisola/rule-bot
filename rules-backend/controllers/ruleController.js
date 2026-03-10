const ruleModel = require("../models/ruleModel");
const aiService = require("../services/aiService");
const { buildPrompt } = require("../utils/promptBuilder");

// 1. AI Evaluation Logic
exports.evaluateAction = async (req, res) => {
  const { action } = req.body || {};

  if (!action?.trim()) {
    return res.status(400).json({ error: "Missing or invalid 'action' field" });
  }

  try {
    const rules = await ruleModel.getActiveRules();
    if (!rules?.length) {
      return res.status(400).json({ error: "No active rules found" });
    }

    const prompt = buildPrompt(action, rules);
    const aiResponse = await aiService.getAIJudgment(prompt);
    const parsed = aiService.parseAIResponse(aiResponse);

    // FIXED: Mapping to your SQL schema 'rule_type'
    parsed.severityNotes = rules
      .filter((r) => r.rule_type?.toLowerCase() === "hard")
      .map((r) => r.rule_text);

    res.json(parsed);
  } catch (err) {
    console.error("Evaluation Controller Error:", err);
    res
      .status(err.status || 500)
      .json({ error: err.message || "Evaluation failed" });
  }
};

// 2. Create New Rule (REFINED)
exports.createRule = async (req, res) => {
  const { rule_text, type, priority } = req.body;

  // Validation: Check for required fields before hitting the DB
  if (!rule_text || !type) {
    return res.status(400).json({ error: "Rule text and type are required." });
  }

  try {
    // We delegate the DB logic to the model we fixed earlier
    const newId = await ruleModel.addRule({ rule_text, type, priority });
    res.status(201).json({
      message: "Principle successfully established.",
      id: newId,
    });
  } catch (err) {
    console.error("Create Rule Controller Error:", err);
    res.status(500).json({ error: "Failed to save the new rule." });
  }
};

// 3. Fetch Active Rules
exports.getAllRules = async (req, res) => {
  try {
    const rules = await ruleModel.getActiveRules();
    res.json(rules);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch active rules" });
  }
};

// 4. Trash Management (Soft Delete)
exports.trashRule = async (req, res) => {
  try {
    const success = await ruleModel.moveToTrash(req.params.id);
    success
      ? res.json({ message: "Rule moved to trash" })
      : res.status(404).json({ error: "Rule not found" });
  } catch (err) {
    res.status(500).json({ error: "Trash operation failed" });
  }
};

// 5. View Trash
exports.getTrash = async (req, res) => {
  try {
    const trashed = await ruleModel.getTrashedRules();
    res.json(trashed);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trash contents" });
  }
};

// 6. Restore Rule
exports.restoreRule = async (req, res) => {
  try {
    const success = await ruleModel.restoreFromTrash(req.params.id);
    success
      ? res.json({ message: "Rule restored successfully" })
      : res.status(404).json({ error: "Rule not found" });
  } catch (err) {
    res.status(500).json({ error: "Restore operation failed" });
  }
};

// 7. Permanent Delete (Hard Delete)
exports.permanentDelete = async (req, res) => {
  try {
    const success = await ruleModel.deletePermanently(req.params.id);
    success
      ? res.json({ message: "Rule permanently purged from database" })
      : res.status(404).json({ error: "Rule not found" });
  } catch (err) {
    console.error("Hard delete controller error:", err);
    res.status(500).json({ error: "Permanent deletion failed" });
  }
};
