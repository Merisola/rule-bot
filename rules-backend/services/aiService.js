const axios = require("axios");

exports.getAIJudgment = async (prompt) => {
  try {
    const response = await axios.post(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
        timeout: 15000,
      },
    );
    return response.data?.choices?.[0]?.message?.content;
  } catch (err) {
    // Handle specific timeouts for Milestone 7 (Graceful Error Handling)
    const error = new Error(
      err.code === "ECONNABORTED" ? "AI Timeout" : "AI Provider Down",
    );
    error.status = err.code === "ECONNABORTED" ? 504 : 502;
    throw error;
  }
};

exports.parseAIResponse = (content) => {
  if (!content) throw new Error("Empty AI response");
  const cleaned = content.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return { judgment: "Parsing Error", explanation: cleaned };
  }
};
