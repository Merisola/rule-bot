import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast"; 

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Accept 'onRestore' as a prop
export default function TrashView({ onRestore }) {
  const [trashed, setTrashed] = useState([]);

  const fetchTrash = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/trash`);
      setTrashed(data);
    } catch (err) {
      toast.error("Failed to load archives."), err;
    }
  };

  useEffect(() => {
    // Define a self-contained async controller
    let isMounted = true;

    const loadData = async () => {
      try {
        await fetchTrash();
      } catch (err) {
        if (isMounted) toast.error("Failed to load archives."), err;
      }
    };

    loadData();

    // Cleanup function to prevent state updates on unmounted components
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array is fine here
  const handleRestore = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/restore/${id}`);
      setTrashed(trashed.filter((r) => r.id !== id));
      // Refresh the main settings list
      if (onRestore) onRestore();
    } catch (err) {
      alert("Failed to restore rule.", err);
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm("This cannot be undone. Delete forever?")) return;
    try {
      // Note: We need to create this backend route next!
      await axios.delete(`${API_BASE_URL}/rules/permanent/${id}`);
      setTrashed(trashed.filter((r) => r.id !== id));
    } catch (err) {
      alert("Failed to permanently delete.", err);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
      <h2 className="text-gray-500 font-semibold mb-4 italic">
        Archived Principles
      </h2>
      {trashed.length === 0 ? (
        <p className="text-gray-400 text-sm italic">The trash is empty.</p>
      ) : (
        trashed.map((rule) => (
          <div
            key={rule.id}
            className="flex justify-between bg-white p-3 mb-2 rounded shadow-sm"
          >
            <span className="text-gray-400 line-through">{rule.rule_text}</span>
            <div className="space-x-4">
              <button
                onClick={() => handleRestore(rule.id)}
                className="text-blue-500 text-sm font-medium hover:text-blue-700"
              >
                Restore
              </button>
              <button
                onClick={() => handlePermanentDelete(rule.id)}
                className="text-red-400 text-sm font-medium hover:text-red-600"
              >
                Delete Forever
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
