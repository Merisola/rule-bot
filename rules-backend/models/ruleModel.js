const db = require("./db"); // Assuming db.js is now in the models folder

/**
 * Fetches only rules that are active AND not in the trash.
 */
exports.getActiveRules = async () => {
  const [rows] = await db.query(
    "SELECT * FROM rules WHERE active = TRUE AND is_deleted = FALSE ORDER BY priority DESC, severity DESC",
  );
  return rows;
};

/**
 * Moves a rule to the trash (Soft Delete).
 */
exports.moveToTrash = async (ruleId) => {
  const [result] = await db.query(
    "UPDATE rules SET is_deleted = TRUE, deleted_at = NOW() WHERE id = ?",
    [ruleId],
  );
  return result.affectedRows > 0;
};

/**
 * Fetches rules currently in the trash.
 */
exports.getTrashedRules = async () => {
  const [rows] = await db.query(
    "SELECT * FROM rules WHERE is_deleted = TRUE ORDER BY deleted_at DESC",
  );
  return rows;
};

/**
 * Restores a rule from the trash.
 */
exports.restoreFromTrash = async (ruleId) => {
  const [result] = await db.query(
    "UPDATE rules SET is_deleted = FALSE, deleted_at = NULL WHERE id = ?",
    [ruleId],
  );
  return result.affectedRows > 0;
};

// Inside models/ruleModel.js

exports.deletePermanently = async (id) => {
  try {
    // This is where the actual SQL execution happens
    const [result] = await db.query("DELETE FROM rules WHERE id = ?", [id]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Database Error during hard delete:", err);
    throw err;
  }
};

exports.addRule = async (ruleData) => {
  const { rule_text, type, priority } = ruleData;
  try {
    // Correct mapping for your specific SQL schema
    const ruleType = type.toUpperCase();
    const severity = ruleType === "HARD" ? "ABSOLUTE" : "MEDIUM";

    const [result] = await db.query(
      "INSERT INTO rules (rule_text, rule_type, severity, priority, active, is_deleted) VALUES (?, ?, ?, ?, TRUE, FALSE)",
      [rule_text, ruleType, severity, priority],
    );
    return result.insertId;
  } catch (err) {
    console.error("Database Error in addRule:", err);
    throw err;
  }
};