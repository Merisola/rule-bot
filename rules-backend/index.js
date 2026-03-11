require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ruleRoutes = require("./routes/ruleRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// --- 1. Middleware ---
app.use(cors());
app.use(express.json());
// Serve static files (useful for Milestone 8's 404 page)
app.use(express.static("public"));

// --- 2. Routes ---
// This mounts all rule-related paths (evaluate, trash, settings) under /api
app.use("/api", ruleRoutes);
app.use(errorHandler);

// Health check
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ status: "Online", message: "Rules Engine is operational." });
});

// --- 3. Milestone 8: Global 404 Handler ---
app.use((req, res) => {
  res
    .status(404)
    .json({ error: "Route not found. Check your URL or documentation." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server soaring on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
