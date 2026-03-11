import { useState } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://rule-backend.themeronway.com";

export default function App() {
  const [action, setAction] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!action.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/evaluate`,
        { action },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 15000,
        },
      );

      setResponse(data);
    } catch (err) {
      console.error("API error:", err);

      setResponse({
        error:
          err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Rules Chatbot</h1>

      <textarea
        className="w-full p-2 border border-gray-300 rounded resize-none"
        rows={4}
        placeholder="Type your action here..."
        value={action}
        onChange={(e) => setAction(e.target.value)}
      />

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Evaluating..." : "Evaluate"}
      </button>

      {response && (
        <div className="mt-6 p-4 border border-gray-200 rounded bg-gray-50">
          {response.error ? (
            <div className="text-red-600">{response.error}</div>
          ) : (
            <>
              <div className="font-bold mb-1">Judgment</div>
              <div className="mb-2">{response.judgment}</div>

              <div className="font-bold mb-1">Violations</div>
              <div className="text-red-600 mb-2">
                {response.violations?.length
                  ? response.violations.join(", ")
                  : "None"}
              </div>

              <div className="font-bold mb-1">Explanation</div>
              <div className="mb-2">{response.explanation}</div>

              <div className="italic text-gray-600">
                {response.reflection_prompt}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
