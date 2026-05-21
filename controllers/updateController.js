const db = require("../db/dbQueries");
const { body, matchedData, validationResult } = require("express-validator");

// on initial update path, use query params to find and display current db info on found item in a form.
async function renderUpdateForm(req, res) {
  const itemName = req.query.name;
  const itemRarity = req.query.rarity;

  // foundItem is an object that contains the rows array (recordArr) and the item's category (itemCategory)
  const foundItem = await db.findItem(itemName, itemRarity);

  console.log(foundItem);

  res.render("update", {
    item: foundItem.recordArr[0],
    category: foundItem.itemCategory,
    validationErr: false,
  });
}

// weapon update validation
const weaponChain = [
  body("amount")
    .notEmpty()
    .withMessage("Amount must not be empty")
    .trim()
    .isNumeric()
    .withMessage("Amount must be numeric"),
  body("itemName").notEmpty().withMessage("Item Name must not be empty").trim(),
  body("magSize")
    .notEmpty()
    .withMessage("Mag Size must not be empty")
    .trim()
    .isNumeric()
    .withMessage("Mag Size must be numeric"),
  body("damage")
    .notEmpty()
    .withMessage("Damage must not be empty")
    .trim()
    .isNumeric()
    .withMessage("Damage must be numeric"),
  body("dps")
    .notEmpty()
    .withMessage("DPS must not be empty")
    .trim()
    .isNumeric()
    .withMessage("DPS must be numeric"),
  body("crit")
    .notEmpty()
    .withMessage("Crit must not be empty")
    .trim()
    .isNumeric()
    .withMessage("Crit must be numeric"),
  body("fireRate")
    .notEmpty()
    .withMessage("Fire Rate must not be empty")
    .trim()
    .isNumeric()
    .withMessage("Fire Rate must be numeric"),
  body("reloadTime")
    .notEmpty()
    .withMessage("Reload Time must not be empty")
    .trim()
    .isNumeric()
    .withMessage("Reload Time must be numeric"),
  body("imgLink").notEmpty().withMessage("Image Link must not be empty").trim(),
];

// run update function for weapons
const updateWeapon = [
  weaponChain,
  async (req, res) => {
    const result = validationResult(req);

    // if there are validation errors inside the result object, render error message
    if (!result.isEmpty()) {
      console.log("Validation error in updateWeapon.");

      const currentItemName = req.query.name;
      const currentItemRarity = req.query.rarity;

      const foundItem = await db.findItem(currentItemName, currentItemRarity);

      return res.status(400).render("update", {
        validationErr: true,
        validationArr: result.array(),
        category: req.params.category,
        item: foundItem.recordArr[0],
      });
    }

    console.log("validation passed.");

    res.redirect("/");
  },
];

// consumable update validation
const consumableChain = [
  body("amount")
    .notEmpty()
    .withMessage("Amount must not be empty")
    .trim()
    .isNumeric()
    .withMessage("Amount must be numeric"),
  body("itemName").notEmpty().withMessage("Item Name must not be empty").trim(),
  body("healAmount")
    .notEmpty()
    .withMessage("Heal Amount must not be empty")
    .trim()
    .isNumeric()
    .withMessage("Heal Amount must be numeric"),
  body("shieldAmount")
    .notEmpty()
    .withMessage("Shield Amount must not be empty")
    .trim()
    .isNumeric()
    .withMessage("Shield Amount must be numeric"),
  body("effect").trim(),
  body("imgLink").notEmpty().withMessage("Image Link must not be empty").trim(),
];

// run update function for consumables
const updateConsumable = [
  consumableChain,
  async (req, res) => {
    const result = validationResult(req);

    // if there are validation errors inside the result object, render error message
    if (!result.isEmpty()) {
      console.log("Validation error in updateWeapon.");

      const currentItemName = req.query.name;
      const currentItemRarity = req.query.rarity;

      const foundItem = await db.findItem(currentItemName, currentItemRarity);

      return res.status(400).render("update", {
        validationErr: true,
        validationArr: result.array(),
        category: req.params.category,
        item: foundItem.recordArr[0],
      });
    }

    console.log("validation passed.");

    res.redirect("/");
  },
];

// utility update validation
const utilityChain = [
  body("amount")
    .notEmpty()
    .withMessage("Amount must not be empty")
    .trim()
    .isNumeric()
    .withMessage("Amount must be numeric"),
  body("itemName").notEmpty().withMessage("Item Name must not be empty").trim(),
  body("maxStacks")
    .notEmpty()
    .withMessage("Max Stacks must not be empty")
    .trim()
    .isNumeric()
    .withMessage("Max Stacks must be numeric"),
  body("description")
    .notEmpty()
    .withMessage("Description must not be empty")
    .trim()
    .isLength({ max: 300 })
    .withMessage("Description must be within 1-300 characters"),
  body("imgLink").notEmpty().withMessage("Image Link must not be empty").trim(),
];

// run update function for utilities
const updateUtility =  [
  utilityChain,
  async (req, res) => {
    const result = validationResult(req);

    // if there are validation errors inside the result object, render error message
    if (!result.isEmpty()) {
      console.log("Validation error in updateWeapon.");

      const currentItemName = req.query.name;
      const currentItemRarity = req.query.rarity;

      const foundItem = await db.findItem(currentItemName, currentItemRarity);

      return res.status(400).render("update", {
        validationErr: true,
        validationArr: result.array(),
        category: req.params.category,
        item: foundItem.recordArr[0],
      });
    }

    console.log("validation passed.");

    res.redirect("/");
  },
];

module.exports = {
  renderUpdateForm,
  updateWeapon,
  updateConsumable,
  updateUtility,
};
