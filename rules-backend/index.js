const express = require("express");
const cors = require("cors");
const evaluateRouter = require("./evaluate"); // AI-enabled route
const pool = require("./db"); 

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Hello World. Rules engine is alive.");
});

// Use evaluate route
app.use("/evaluate", evaluateRouter);





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
