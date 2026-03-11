const express = require("express");
const router = express.Router();
const ruleController = require("../controllers/ruleController");

// --- Core AI Logic ---
router.post("/evaluate", ruleController.evaluateAction);

// --- Active Rule Management ---
router.get("/rules", ruleController.getAllRules);
router.delete("/rules/:id", ruleController.trashRule); // Soft delete (Move to trash)

// --- Trash & Recovery Management ---
router.get("/trash", ruleController.getTrash);
router.put("/restore/:id", ruleController.restoreRule); // Restore from trash
router.delete("/rules/permanent/:id", ruleController.permanentDelete); // Hard delete (Forever)
router.post("/rules", ruleController.createRule);

module.exports = router;
