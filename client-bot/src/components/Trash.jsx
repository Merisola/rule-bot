import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Trash() {
  const [trashedRules, setTrashedRules] = useState([]);

  const fetchTrash = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/trash`);
      setTrashedRules(data);
    } catch (err) {
      console.error("Error fetching trash,", err);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const handleRestore = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/restore/${id}`);
      setTrashedRules(trashedRules.filter((r) => r.id !== id));
    } catch (err) {
      alert("Restore failed", err);
    }
  };

  return (
    <div className="mt-10 opacity-75">
      <h2 className="text-xl font-bold text-gray-500 mb-4">Archive / Trash</h2>
      <div className="bg-gray-100 rounded-lg p-4">
        {trashedRules.length === 0 ? (
          <p className="text-gray-400">Trash is empty.</p>
        ) : (
          <ul className="space-y-2">
            {trashedRules.map((rule) => (
              <li
                key={rule.id}
                className="flex justify-between items-center bg-white p-3 rounded shadow-sm"
              >
                <span className="text-gray-600 line-through">
                  {rule.rule_text}
                </span>
                <button
                  onClick={() => handleRestore(rule.id)}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
