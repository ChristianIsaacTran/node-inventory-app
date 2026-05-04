const pool = require("./pool");
const format = require("pg-format");

// returns an object containing an array of all entries from weapons table, utilities table, and consumables table
async function getAllItems() {
  try {
    // get all rows from weapons table, replace item_type FK and item_rarity FK with named values
    const weaponsQuery = `
    SELECT 
      weapons.item_name,
      item_type.type,
      rarity_type.rarity,
      weapons.bullet_type,
      weapons.mag_size,
      weapons.damage,
      weapons.dps,
      weapons.crit,
      weapons.fire_rate,
      weapons.reload_time,
      weapons.image_url,
      weapons.amount
    FROM weapons 
    JOIN item_type ON weapons.item_category = item_type.id
    JOIN rarity_type ON weapons.item_rarity = rarity_type.id`;
    const weaponsResult = await pool.query(weaponsQuery);
    const weaponsRows = weaponsResult.rows;

    // // get all rows from consumables table
    // const conQuery = `SELECT * FROM consumables`;
    // const conRows = await pool.query(consumablesQuery).rows;

    // // get all rows from utilities table
    // const utilQuery = `SELECT * FROM weapons`;
    // const utilRows = await pool.query(weaponsQuery).rows;

    // return { weaponsRows, conRows, utilRows };
    return {weaponsRows};
  } catch (error) {
    console.log(error);
  }
}

module.exports = { getAllItems };
