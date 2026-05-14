const db = require("../db/dbQueries");

// sends a delete request to the db and redirects user immediately back to home
async function renderDelete(req, res) {
  const itemName = req.query.name;
  const itemRarity = req.query.rarity;
  const itemCategory = req.query.category;

  await db.deleteItem(itemName, itemRarity, itemCategory);

  res.redirect("/");
}

module.exports = { renderDelete };
