const express = require("express");
const router = express.Router();
const ruleController = require("../controllers/ruleController");

// Define the POST endpoint for evaluation
router.post("/evaluate", ruleController.evaluateAction);

module.exports = router;
