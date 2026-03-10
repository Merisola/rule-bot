// rulesService.js
const db = require("./db");

async function getActiveRules() {
  const [rows] = await db.query(
    "SELECT * FROM rules WHERE active = TRUE ORDER BY priority DESC, severity DESC",
  );
  return rows;
}

module.exports = { getActiveRules };
