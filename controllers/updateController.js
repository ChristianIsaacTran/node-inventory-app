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
    .withMessage("Amount must be numeric")
    .isInt({ min: 0 })
    .withMessage("Amount must be an integer 0 or above"),
  body("itemName").notEmpty().withMessage("Item Name must not be empty").trim(),
  body("magSize")
    .notEmpty()
    .withMessage("Mag Size must not be empty")
    .trim()
    .isNumeric()
    .withMessage("Mag Size must be numeric")
    .isInt({ min: 0 })
    .withMessage("Mag Size must be an integer 0 or above"),
  body("damage")
    .notEmpty()
    .withMessage("Damage must not be empty")
    .trim()
    .isNumeric()
    .withMessage("Damage must be numeric")
    .isFloat({ min: 0 })
    .withMessage("Damage must be a float 0 or above"),
  body("dps")
    .notEmpty()
    .withMessage("DPS must not be empty")
    .trim()
    .isNumeric()
    .withMessage("DPS must be numeric")
    .isFloat({ min: 0 })
    .withMessage("DPS must be a float 0 or above"),
  body("crit")
    .notEmpty()
    .withMessage("Crit must not be empty")
    .trim()
    .isNumeric()
    .withMessage("Crit must be numeric")
    .isFloat({ min: 0 })
    .withMessage("Crit must be a float 0 or above"),
  body("fireRate")
    .notEmpty()
    .withMessage("Fire Rate must not be empty")
    .trim()
    .isNumeric()
    .withMessage("Fire Rate must be numeric")
    .isFloat({ min: 0 })
    .withMessage("Fire Rate must be a float 0 or above"),
  body("reloadTime")
    .notEmpty()
    .withMessage("Reload Time must not be empty")
    .trim()
    .isNumeric()
    .withMessage("Reload Time must be numeric")
    .isFloat({ min: 0 })
    .withMessage("Reload Time must be a float 0 or above"),
  body("imgLink").notEmpty().withMessage("Image Link must not be empty").trim(),
];

// run update function for weapons
const updateWeapon = [
  weaponChain,
  async (req, res) => {
    const result = validationResult(req);

    const currentItemName = req.query.name;
    const currentItemRarity = req.query.rarity;

    // if there are validation errors inside the result object, render error message
    if (!result.isEmpty()) {
      const foundItem = await db.findItem(currentItemName, currentItemRarity);

      return res.status(400).render("update", {
        validationErr: true,
        validationArr: result.array(),
        category: req.params.category,
        item: foundItem.recordArr[0],
      });
    }

    // if no validation errors, send request to database

    await db.updateWeaponDB(currentItemName, currentItemRarity, req.body);

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
    .withMessage("Amount must be numeric")
    .isInt({ min: 0 })
    .withMessage("Amount must be an integer 0 or above"),
  body("itemName").notEmpty().withMessage("Item Name must not be empty").trim(),
  body("healAmount")
    .notEmpty()
    .withMessage("Heal Amount must not be empty")
    .trim()
    .isNumeric()
    .withMessage("Heal Amount must be numeric")
    .isFloat({ min: 0 })
    .withMessage("Heal Amount must be a float 0 or above"),
  body("shieldAmount")
    .notEmpty()
    .withMessage("Shield Amount must not be empty")
    .trim()
    .isNumeric()
    .withMessage("Shield Amount must be numeric")
    .isFloat({ min: 0 })
    .withMessage("Shield Amount must be a float 0 or above"),
  body("effect").trim(),
  body("imgLink").notEmpty().withMessage("Image Link must not be empty").trim(),
];

// run update function for consumables
const updateConsumable = [
  consumableChain,
  async (req, res) => {
    const result = validationResult(req);

    const currentItemName = req.query.name;
    const currentItemRarity = req.query.rarity;

    // if there are validation errors inside the result object, render error message
    if (!result.isEmpty()) {
      const foundItem = await db.findItem(currentItemName, currentItemRarity);

      return res.status(400).render("update", {
        validationErr: true,
        validationArr: result.array(),
        category: req.params.category,
        item: foundItem.recordArr[0],
      });
    }

    // if no validation errors, send request to database

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
    .withMessage("Amount must be numeric")
    .isInt({ min: 0 })
    .withMessage("Amount must be an integer 0 or above"),
  body("itemName").notEmpty().withMessage("Item Name must not be empty").trim(),
  body("maxStacks")
    .notEmpty()
    .withMessage("Max Stacks must not be empty")
    .trim()
    .isNumeric()
    .withMessage("Max Stacks must be numeric")
    .isInt({ min: 0 })
    .withMessage("Max Stacks must be an integer 0 or above"),
  body("description")
    .notEmpty()
    .withMessage("Description must not be empty")
    .trim()
    .isLength({ max: 300 })
    .withMessage("Description must be within 1-300 characters"),
  body("imgLink").notEmpty().withMessage("Image Link must not be empty").trim(),
];

// run update function for utilities
const updateUtility = [
  utilityChain,
  async (req, res) => {
    const result = validationResult(req);

    const currentItemName = req.query.name;
    const currentItemRarity = req.query.rarity;

    // if there are validation errors inside the result object, render error message
    if (!result.isEmpty()) {
      const foundItem = await db.findItem(currentItemName, currentItemRarity);

      return res.status(400).render("update", {
        validationErr: true,
        validationArr: result.array(),
        category: req.params.category,
        item: foundItem.recordArr[0],
      });
    }

    // if no validation errors, send request to database

    res.redirect("/");
  },
];

module.exports = {
  renderUpdateForm,
  updateWeapon,
  updateConsumable,
  updateUtility,
};
