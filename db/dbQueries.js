const pool = require("./pool");
const format = require("pg-format");

// utility function. Checks if the category found in rows array from result object is from the weapon category. Returns a boolean. For use in findItem() and deleteItem()
async function isWeaponCategory(category) {
  const categoryArr = [
    "assault rifle",
    "shotgun",
    "submachine gun",
    "pistol",
    "sniper rifle",
    "marksman rifle",
    "explosive weapon",
    "special weapon",
  ];

  let isWeapon = false;

  if (categoryArr.includes(category)) {
    isWeapon = true;
  }

  return isWeapon;
}

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
    JOIN rarity_type ON weapons.item_rarity = rarity_type.id
    ORDER BY weapons.id`;
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
    JOIN rarity_type ON consumables.item_rarity = rarity_type.id
    ORDER BY consumables.id`;
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
    JOIN rarity_type ON utilities.item_rarity = rarity_type.id
    ORDER BY utilities.id`;
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
      return { recordArr: weaponsRows, itemCategory: "weapon" };
    } else if (consumablesRows.length !== 0) {
      // console.log(consumablesRows);
      return { recordArr: consumablesRows, itemCategory: "consumable" };
    } else if (utilitiesRows.length !== 0) {
      // console.log(utilitiesRows);
      return { recordArr: utilitiesRows, itemCategory: "utility" };
    }

    return new Error("Error: No entries found in db tables.");
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
}

// deletes an item from the database through the delete route through query params
async function deleteItem(name, rarity, category) {
  /*
    Added a category parameter to narrow down what table to query from. 
    *Should add category to findItem function to prevent 3 queries*
  */
  try {
    // check if the item to delete IS a weapon, then run weapon query.
    if (await isWeaponCategory(category)) {
      const weaponDeleteQuery = `
      DELETE FROM weapons AS t1 
      USING rarity_type AS t2
      WHERE t1.item_rarity = t2.id 
      AND t1.item_name = $1 
      AND t2.rarity = $2`;

      await pool.query(weaponDeleteQuery, [`${name}`, `${rarity}`]);
      return console.log("Item successfully deleted.");
    } else if (category === "consumable") {
      // run consumable query if item is a consumable
      const consumableDeleteQuery = `
      DELETE FROM consumables AS t1 
      USING rarity_type AS t2
      WHERE t1.item_rarity = t2.id 
      AND t1.item_name = $1 
      AND t2.rarity = $2`;

      await pool.query(consumableDeleteQuery, [`${name}`, `${rarity}`]);
      return console.log("Item successfully deleted.");
    } else if (category === "utility") {
      // run utility query if item is a utility
      const utilityDeleteQuery = `
      DELETE FROM utilities AS t1 
      USING rarity_type AS t2
      WHERE t1.item_rarity = t2.id 
      AND t1.item_name = $1 
      AND t2.rarity = $2`;

      await pool.query(utilityDeleteQuery, [`${name}`, `${rarity}`]);
      return console.log("Item successfully deleted.");
    } else {
      // return error if no item category is found
      console.log("ERROR: no item category found");
      return new Error("ERROR: no item category found.");
    }
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
}

// utility function, returns the ID of the given rarity string
async function convertRarityToID(rarityStr) {
  if (rarityStr === "common") {
    return 1;
  } else if (rarityStr === "uncommon") {
    return 2;
  } else if (rarityStr === "rare") {
    return 3;
  } else if (rarityStr === "epic") {
    return 4;
  } else if (rarityStr === "legendary") {
    return 5;
  } else if (rarityStr === "mythic") {
    return 6;
  } else if (rarityStr === "exotic") {
    return 7;
  }

  return new Error("Error: could not find ID for given rarityStr.");
}

// utility function, returns the ID of the given type string
async function convertTypeToID(typeStr) {
  if (typeStr === "assault rifle") {
    return 1;
  } else if (typeStr === "shotgun") {
    return 2;
  } else if (typeStr === "submachine gun") {
    return 3;
  } else if (typeStr === "pistol") {
    return 4;
  } else if (typeStr === "sniper rifle") {
    return 5;
  } else if (typeStr === "marksman rifle") {
    return 6;
  } else if (typeStr === "explosive weapon") {
    return 7;
  } else if (typeStr === "special weapon") {
    return 8;
  } else if (typeStr === "utility") {
    return 9;
  } else if (typeStr === "consumable") {
    return 10;
  }

  return new Error("Error: could not find ID for given typeStr.");
}

// find and update weapon in database and update it with new values from update form
async function updateWeaponDB(prevName, prevRarity, reqBody) {
  try {
    const weaponUpdateQuery = `
    UPDATE weapons 
    SET 
      item_name = $3,
      item_category = $4,
      item_rarity = $5,
      bullet_type = $6,
      mag_size = $7,
      damage = $8,
      dps = $9,
      crit = $10,
      fire_rate = $11,
      reload_time = $12,
      image_url = $13,
      amount = $14
    WHERE item_name = $1 AND item_rarity = $2
    `;

    // converted rarity and type ID's for PK and FK 
    const rarityID = await convertRarityToID(prevRarity); // for where clause
    const typeID = await convertTypeToID(reqBody.itemCategory);

    // form field data
    const itemName = reqBody.itemName;
    const bulletType = reqBody.bulletType;
    const magSize = reqBody.magSize;
    const damage = reqBody.damage;
    const dps = reqBody.dps;
    const crit = reqBody.crit;
    const fireRate = reqBody.fireRate;
    const reloadTime = reqBody.reloadTime;
    const imgLink = reqBody.imgLink;
    const fieldRarityID = await convertRarityToID(reqBody.itemRarity);
    const amount = reqBody.amount;

    await pool.query(weaponUpdateQuery, [prevName, rarityID, itemName, typeID, fieldRarityID, bulletType, magSize, damage, dps, crit, fireRate, reloadTime, imgLink, amount]);
    return console.log("Updated weapon successful.");

  } catch (error) {
    console.log(error);
    return new Error(error);
  }
}

// find and update consumable in database and update it with new values from update form
async function updateConsumableDB(name, rarity, reqBody) {
  try {
    const consumableUpdateQuery = ``;
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
}

// find and update utility in database and update it with new values from update form
async function updateUtilityDB(name, rarity, reqBody) {
  try {
    const utilityUpdateQuery = ``;
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
}

module.exports = {
  getAllItems,
  findItem,
  deleteItem,
  updateWeaponDB,
  updateConsumableDB,
};
