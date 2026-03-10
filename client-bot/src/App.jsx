import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // 1. Import the provider
import Chat from "./components/Chat";
import Settings from "./components/Settings";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* 2. Place it here so it's always "listening" for toast events */}
        <Toaster position="top-center" reverseOrder={false} />

        <nav className="bg-white shadow-sm p-4 flex justify-between items-center max-w-4xl mx-auto mb-6 rounded-b-lg">
          <h1 className="text-xl font-bold text-blue-600">Rule Alchemist</h1>
          <div className="space-x-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-500 font-medium transition"
            >
              Chat
            </Link>
            <Link
              to="/settings"
              className="text-gray-600 hover:text-blue-500 font-medium transition"
            >
              Settings
            </Link>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 pb-20">
          <Routes>
            <Route path="/" element={<Chat />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
