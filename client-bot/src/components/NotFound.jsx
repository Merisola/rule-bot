import { Link } from "react-router-dom";
import { Sparkles, Home, Map } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <div className="p-4 bg-amber-100 rounded-3xl mb-6">
        <Map className="text-amber-600 w-12 h-12" />
      </div>
      <h1 className="text-5xl font-black text-slate-800 mb-4 tracking-tighter">
        Lost in the Void
      </h1>
      <p className="text-slate-500 max-w-md mb-8 font-medium">
        This path does not exist within the current laws of the Oracle. Let's
        return to the source.
      </p>
      <Link
        to="/"
        className="flex items-center space-x-2 px-8 py-4 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-200"
      >
        <Home size={16} />
        <span>Return Home</span>
      </Link>
    </div>
  );
}
