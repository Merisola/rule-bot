const express = require("express");
const axios = require("axios");
const { getActiveRules } = require("./rulesService"); // Your MySQL fetch function
const { buildPrompt } = require("./promptBuilder"); // Prompt builder

const router = express.Router();

router.post("/", async (req, res) => {
  const { action } = req.body || {};

  // --- 1. Empty input guard ---
  if (!action || typeof action !== "string" || !action.trim()) {
    return res.status(400).json({ error: "Missing or invalid 'action' field" });
  }

  try {
    // --- 2. Fetch rules from DB ---
    let rules;
    try {
      rules = await getActiveRules();
      if (!rules || rules.length === 0) {
        return res.status(400).json({ error: "No active rules found" });
      }
    } catch (dbErr) {
      console.error("DB error:", dbErr);
      return res
        .status(500)
        .json({ error: "Failed to fetch rules from database." });
    }

    // --- 3. Build prompt for AI ---
    const prompt = buildPrompt(action, rules);

    // --- 4. Call Hugging Face router API with timeout ---
    let hfResponse;
    try {
      hfResponse = await axios.post(
        "https://router.huggingface.co/v1/chat/completions",
        {
          model: "meta-llama/Llama-3.1-8B-Instruct",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 15000, // 15-second timeout
        },
      );
    } catch (hfErr) {
      console.error(
        "Hugging Face API error:",
        hfErr.response?.data || hfErr.message,
      );

      if (hfErr.code === "ECONNABORTED") {
        return res
          .status(504)
          .json({ error: "AI request timed out. Try again later." });
      }

      return res
        .status(502)
        .json({ error: "AI model failed to respond. Try again later." });
    }

    // --- 5. Safely extract AI content ---
    const aiContent = hfResponse?.data?.choices?.[0]?.message?.content;

    if (!aiContent) {
      return res
        .status(502)
        .json({ error: "AI model returned empty or malformed response." });
    }

    // --- 6. Parse AI JSON safely ---
    const cleaned = aiContent.replace(/```json|```/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        judgment: "Unable to parse AI response",
        violations: [],
        explanation: cleaned || "AI returned unexpected output.",
        reflection_prompt: "Reflect on the action and the rules manually.",
      };
    }

    // --- 7. Add severity notes from hard rules ---
    parsed.severityNotes = rules
      .filter((r) => r.type === "hard")
      .map((r) => r.rule_text);

    // --- 8. Return structured response ---
    res.json(parsed);
  } catch (err) {
    console.error("Full backend error:", err);
    res.status(500).json({
      error: "Failed to evaluate action",
      details: err.message,
    });
  }
});

module.exports = router;
