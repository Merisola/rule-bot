import { useState } from "react";
import axios from "axios";
import { Sparkles, ShieldAlert, CheckCircle, Info, Send } from "lucide-react";
import { toast } from "react-hot-toast";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://rule-backend.themeronway.com";

export default function App() {
  const [action, setAction] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="h-32 bg-slate-200 rounded-3xl w-full" />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="h-40 bg-slate-200 rounded-3xl w-full" />
        <div className="h-40 bg-slate-200 rounded-3xl w-full" />
      </div>
      <div className="h-24 bg-slate-200 rounded-3xl w-full" />
    </div>
  );

  const handleSubmit = async () => {
    if (!action.trim()) return;
    setLoading(true);
    setResponse(null);

    try {
      const { data } = await axios.post(`${API_BASE_URL}/evaluate`, { action });
      setResponse(data);
    } catch (err) {
        toast.error("Evaluation failed. Please check your connection.");
      setResponse({
        error: err.response?.data?.error || "Neural link failure.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-1 px-4 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-block p-3 bg-blue-600 rounded-2xl mb-4 shadow-xl shadow-blue-200">
            <Sparkles className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-800 mb-2">
            Alchemist <span className="text-blue-600">Oracle</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Transform confusion into clarity through your principles.
          </p>
        </header>

        {/* Input Terminal */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100 mb-8">
          <div className="p-1 bg-slate-50 border-b flex items-center space-x-2 px-6 py-3">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">
              Neural Input Path
            </span>
          </div>

          <div className="p-6">
            <textarea
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-lg resize-none min-h-[120px]"
              placeholder="Describe your intended action..."
              value={action}
              onChange={(e) => setAction(e.target.value)}
            />
            <button
              className="w-full mt-4 flex items-center justify-center space-x-2 py-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all font-bold disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading || !action.trim()}
            >
              {loading ? (
                <span>Synthesizing...</span>
              ) : (
                <>
                  <span>Evaluate</span>
                  <Send size={18} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Unified Results Area */}
        <div className="mt-8 min-h-[400px]">
          {loading && <LoadingSkeleton />}

          {response && !loading && (
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
              {response.error ? (
                <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center space-x-4">
                  <ShieldAlert className="text-red-500 w-8 h-8" />
                  <p className="text-red-700 font-bold">{response.error}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Hero Card */}
                  <div
                    className={`p-8 rounded-3xl shadow-lg border transition-colors ${response.violations?.length > 0 ? "bg-amber-50 border-amber-100" : "bg-emerald-50 border-emerald-100"}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest mb-2 opacity-50">
                          Diagnostic Result
                        </h3>
                        <p
                          className={`text-3xl font-black ${response.violations?.length > 0 ? "text-amber-700" : "text-emerald-700"}`}
                        >
                          {response.judgment}
                        </p>
                      </div>
                      {response.violations?.length > 0 ? (
                        <ShieldAlert className="w-12 h-12 text-amber-500" />
                      ) : (
                        <CheckCircle className="w-12 h-12 text-emerald-500" />
                      )}
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 mb-3">
                        <Info className="w-4 h-4 text-blue-500" />
                        <span className="font-black text-[10px] uppercase tracking-wider text-slate-400">
                          Contextual Analysis
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {response.explanation}
                      </p>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 mb-3">
                        <ShieldAlert className="w-4 h-4 text-red-500" />
                        <span className="font-black text-[10px] uppercase tracking-wider text-slate-400">
                          Boundary Breaches
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {response.violations?.length > 0 ? (
                          response.violations.map((v, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100"
                            >
                              # {v}
                            </span>
                          ))
                        ) : (
                          <span className="text-emerald-600 text-xs font-bold italic">
                            Principles fully intact.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reflection */}
                  <div className="bg-slate-900 p-8 rounded-3xl text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
                    <p className="relative z-10 text-lg font-medium italic opacity-90">
                      "{response.reflection_prompt}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
