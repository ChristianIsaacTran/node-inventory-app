const db = require("../db/dbQueries");

async function displayDetails(req, res) {
  const itemName = req.query.name;
  const itemRarity = req.query.rarity;

  // should be an array with a single item returned
  const item = await db.findItem(itemName, itemRarity);

  res.render("details", {
    name: itemName,
    rarity: itemRarity,
    item: item.recordArr[0],
    itemCategory: item.itemCategory,
  });
}

module.exports = { displayDetails };
