const db = require("../db/dbQueries");
async function renderHome(req, res) {
  const records = await db.getAllItems();
  res.render("home", { records: records });
}

module.exports = { renderHome };
