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

    // get all rows from consumables table
    const conQuery = `
    SELECT  
      consumables.item_name,
      item_type.type,
      rarity_type.rarity,
      consumables.heal_amount,
      consumables.shield_amount,
      consumables.effect,
      consumables.image_url,
      consumables.amount

    FROM consumables
    JOIN item_type ON consumables.item_category = item_type.id
    JOIN rarity_type ON consumables.item_rarity = rarity_type.id`;
    const conResult = await pool.query(conQuery);
    const conRows = conResult.rows;

    // get all rows from utilities table
    const utilQuery = `SELECT  
      utilities.item_name,
      item_type.type,
      rarity_type.rarity,
      utilities.max_stack,
      utilities.item_description,
      utilities.image_url,
      utilities.amount

    FROM utilities
    JOIN item_type ON utilities.item_category = item_type.id
    JOIN rarity_type ON utilities.item_rarity = rarity_type.id`;
    const utilResult = await pool.query(utilQuery);
    const utilRows = utilResult.rows;

    return { weaponsRows, conRows, utilRows };
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
}

// search database and query for the item with the same name and rarity. Return an array with item and a category type string
async function findItem(name, rarity) {
  try {
    // check each table for the existence of the item. The plan is to prevent duplicate items from being added into db so assume theres only 1 of every item
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
    JOIN rarity_type ON weapons.item_rarity = rarity_type.id
    WHERE item_name = $1 AND rarity = $2`;

    const consumablesQuery = `
    SELECT  
      consumables.item_name,
      item_type.type,
      rarity_type.rarity,
      consumables.heal_amount,
      consumables.shield_amount,
      consumables.effect,
      consumables.image_url,
      consumables.amount

    FROM consumables
    JOIN item_type ON consumables.item_category = item_type.id
    JOIN rarity_type ON consumables.item_rarity = rarity_type.id
    WHERE item_name = $1 AND rarity = $2`;

    const utilitiesQuery = `SELECT  
      utilities.item_name,
      item_type.type,
      rarity_type.rarity,
      utilities.max_stack,
      utilities.item_description,
      utilities.image_url,
      utilities.amount
    FROM utilities
    JOIN item_type ON utilities.item_category = item_type.id
    JOIN rarity_type ON utilities.item_rarity = rarity_type.id
    WHERE item_name = $1 AND rarity = $2`;

    const weaponsResult = await pool.query(weaponsQuery, [
      `${name}`,
      `${rarity}`,
    ]);
    const consumablesResult = await pool.query(consumablesQuery, [
      `${name}`,
      `${rarity}`,
    ]);
    const utilitiesResult = await pool.query(utilitiesQuery, [
      `${name}`,
      `${rarity}`,
    ]);

    const weaponsRows = weaponsResult.rows;
    const consumablesRows = consumablesResult.rows;
    const utilitiesRows = utilitiesResult.rows;

    // check if result rows is 0. If it is not 0, then return that rows of data
    if (weaponsRows.length !== 0) {
      // console.log(weaponsRows);
      return { recordArr: weaponsRows, itemCategory: "weapon"};
    } else if (consumablesRows.length !== 0) {
      // console.log(consumablesRows);
      return { recordArr: consumablesRows, itemCategory: "consumable"};
    } else if (utilitiesRows.length !== 0) {
      // console.log(utilitiesRows);
      return { recordArr: utilitiesRows, itemCategory: "utility"};
    }

    return new Error("Error: No entries found in db tables.");
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
}

module.exports = { getAllItems, findItem };
