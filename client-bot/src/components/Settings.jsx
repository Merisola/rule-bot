import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  Trash2,
  Plus,
  Shield,
  ArrowLeft,
  Loader2,
  ListOrdered,
} from "lucide-react";
import TrashView from "./TrashView";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://rule-backend.themeronway.com";

export default function Settings() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrash, setShowTrash] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRule, setNewRule] = useState({
    rule_text: "",
    type: "soft",
    priority: 1,
  });

  const fetchRules = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/rules`);
      setRules(data);
    } catch (err) {
      toast.error("Failed to sync principles.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const loadId = toast.loading("Forging principle...");
    try {
      await axios.post(`${API_BASE_URL}/rules`, newRule);
      toast.success("Principle established.", { id: loadId });
      setIsModalOpen(false);
      setNewRule({ rule_text: "", type: "soft", priority: 1 });
      fetchRules();
    } catch (err) {
      toast.error(err.response?.data?.error || "Forging failed.", {
        id: loadId,
      });
    }
  };

  const handleTrash = async (id) => {
    toast(
      (t) => (
        <span className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-2 sm:space-y-0">
          <b className="text-xs sm:text-sm">Archive this rule?</b>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold w-full sm:w-auto"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await axios.delete(`${API_BASE_URL}/rules/${id}`);
                setRules(rules.filter((r) => r.id !== id));
                toast.success("Rule moved to archives.");
              } catch (err) {
                toast.error("Archiving failed.", err);
              }
            }}
          >
            Yes, Archive
          </button>
        </span>
      ),
      { duration: 5000 },
    );
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="font-bold tracking-widest text-[10px] sm:text-xs uppercase">
          Syncing with Central Records...
        </p>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 animate-in fade-in duration-700">
      {/* Header - Stacked on mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight italic">
            {showTrash ? "Archives" : "Operational Boundaries"}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium">
            Define the constraints that govern your potential.
          </p>
        </div>

        <div className="flex space-x-2 sm:space-x-4 w-full sm:w-auto">
          <button
            onClick={() => setShowTrash(!showTrash)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm text-xs sm:text-sm"
          >
            {showTrash ? (
              <>
                <ArrowLeft size={16} />{" "}
                <span className="hidden xs:inline">Active Rules</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />{" "}
                <span className="hidden xs:inline">View Trash</span>
              </>
            )}
            {/* Minimalist text for ultra-small screens */}
            {!showTrash && <span className="xs:hidden">Trash</span>}
            {showTrash && <span className="xs:hidden">Back</span>}
          </button>

          {!showTrash && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-6 py-2.5 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all text-xs sm:text-sm"
            >
              <Plus size={18} /> <span>New Principle</span>
            </button>
          )}
        </div>
      </div>

      {showTrash ? (
        <TrashView onRestore={fetchRules} />
      ) : (
        <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Scroll wrapper for table responsiveness */}
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px] sm:min-w-0">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                <tr>
                  <th className="px-6 sm:px-8 py-5">Core Principle</th>
                  <th className="px-4 py-5 text-center">Rigidity</th>
                  <th className="px-4 py-5 text-center">Priority</th>
                  <th className="px-6 sm:px-8 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rules.map((rule) => (
                  <tr
                    key={rule.id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 sm:px-8 py-6">
                      <p className="text-slate-700 font-bold text-sm leading-relaxed max-w-xs sm:max-w-none">
                        {rule.rule_text}
                      </p>
                    </td>
                    <td className="px-4 py-6 text-center">
                      <span
                        className={`px-3 sm:px-4 py-1.5 rounded-full text-[9px] sm:text-[10px] font-black tracking-widest uppercase border ${
                          (rule.rule_type || rule.type)?.toLowerCase() ===
                          "hard"
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                        }`}
                      >
                        {rule.rule_type || rule.type || "soft"}
                      </span>
                    </td>
                    <td className="px-4 py-6 text-center">
                      <span className="text-slate-400 font-mono text-xs">
                        P-{rule.priority || 0}
                      </span>
                    </td>
                    <td className="px-6 sm:px-8 py-6 text-right">
                      <button
                        onClick={() => handleTrash(rule.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rules.length === 0 && (
            <div className="p-10 sm:p-20 text-center space-y-4">
              <Shield className="mx-auto w-10 h-10 sm:w-12 sm:h-12 text-slate-200" />
              <p className="text-slate-400 font-medium italic text-xs sm:text-sm">
                No active principles in effect. Your potential is unguided.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal - Optimized for mobile tap targets and viewports */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-0 sm:p-6">
          <div className="bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
            <div className="p-6 sm:p-8 border-b border-slate-50 bg-slate-50/50">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tighter">
                Drafting Principle
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm font-medium">
                Define a new constraint for the Oracle.
              </p>
            </div>
            <form onSubmit={handleCreate} className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  The Boundary
                </label>
                <textarea
                  required
                  className="w-full p-4 sm:p-5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm min-h-[100px] sm:min-h-[120px] resize-none"
                  placeholder="Describe the rule..."
                  value={newRule.rule_text}
                  onChange={(e) =>
                    setNewRule({ ...newRule, rule_text: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Rigidity
                  </label>
                  <select
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none font-bold text-sm text-slate-600 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500"
                    value={newRule.type}
                    onChange={(e) =>
                      setNewRule({ ...newRule, type: e.target.value })
                    }
                  >
                    <option value="soft">Soft (Guideline)</option>
                    <option value="hard">Hard (Absolute)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center justify-between">
                    Priority <span>{newRule.priority}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-4"
                    value={newRule.priority}
                    onChange={(e) =>
                      setNewRule({
                        ...newRule,
                        priority: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex space-x-3 sm:space-x-4 pt-4 pb-6 sm:pb-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl hover:bg-slate-50 transition font-black text-[10px] uppercase tracking-widest"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 shadow-xl shadow-blue-200/20 transition-all font-black text-[10px] uppercase tracking-widest"
                >
                  Establish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
