import { useState } from "react";

export default function App() {
  const [action, setAction] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!action.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("http://localhost:5000/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Rules Chatbot</h1>

      <textarea
        className="w-full p-2 border border-gray-300 rounded"
        rows={4}
        placeholder="Type your action here..."
        value={action}
        onChange={(e) => setAction(e.target.value)}
      />

      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Evaluating..." : "Evaluate"}
      </button>

      {response && (
        <div className="mt-6 p-4 border border-gray-200 rounded bg-gray-50">
          {response.error ? (
            <div className="text-red-500">{response.error}</div>
          ) : (
            <>
              <div className="font-bold mb-2">Judgment:</div>
              <div className="mb-2">{response.judgment}</div>

              <div className="font-bold mb-2">Violations:</div>
              <div className="text-red-600 mb-2">
                {response.violations?.length
                  ? response.violations.join(", ")
                  : "None"}
              </div>

              <div className="font-bold mb-2">Explanation:</div>
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
