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
