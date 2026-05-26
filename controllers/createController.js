const { render } = require("ejs");
const db = require("../db/dbQueries");
const { body, validationResult, matchedData } = require("express-validator");

function renderCreateRoutes(req, res) {
  res.render("createRoute", {});
}

function renderCreateForm(req, res) {
  const formType = req.params.formType;

  // keeps user's input fields if form has validation errors
  const prevInput = req.body;

  res.render("createForm", {
    formType,
    prevInput,
    validationErr: false,
    itemExistsErr: false,
  });
}

// weapon  validation
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

// consumable  validation
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

const addWeapon = [
  weaponChain,
  async (req, res) => {
    const formType = req.query.formType;

    // keeps user's input fields if form has validation errors
    const prevInput = req.body;

    const formItemName = req.body.itemName;
    const formItemRarity = req.body.itemRarity;

    // check if item exists first. if it does, then return an error saying that it already exists in the database
    const foundItemCheck = await db.findItem(formItemName, formItemRarity);
    if (foundItemCheck) {
      return res.status(400).render("createForm", {
        validationErr: false,
        itemExistsErr: true,
        formType,
        prevInput,
      });
    }

    const result = validationResult(req);

    // if there are errors, send error response
    if (!result.isEmpty()) {
      return res.status(400).render("createForm", {
        validationErr: true,
        itemExistsErr: false,
        formType,
        prevInput,
        validationArr: result.array(),
      });
    }

    const data = req.body;

    // add to database if no errors
    await db.addItem(data, formType);

    res.redirect("/");
  },
];

const addConsumable = [
  consumableChain,
  async (req, res) => {
    const formType = req.query.formType;

    // keeps user's input fields if form has validation errors
    const prevInput = req.body;

    const formItemName = req.body.itemName;
    const formItemRarity = req.body.itemRarity;

    // check if item exists first. if it does, then return an error saying that it already exists in the database
    const foundItemCheck = await db.findItem(formItemName, formItemRarity);
    if (foundItemCheck) {
      return res.status(400).render("createForm", {
        validationErr: false,
        itemExistsErr: true,
        formType,
        prevInput,
      });
    }

    const result = validationResult(req);

    // if there are errors, send error response
    if (!result.isEmpty()) {
      return res.status(400).render("createForm", {
        validationErr: true,
        itemExistsErr: false,
        formType,
        prevInput,
        validationArr: result.array(),
      });
    }

    const data = req.body;

    // add to database if no errors
    await db.addItem(data, formType);

    res.redirect("/");
  },
];

const addUtility = [
  utilityChain,
  async (req, res) => {
    const formType = req.query.formType;

    // keeps user's input fields if form has validation errors
    const prevInput = req.body;

    const formItemName = req.body.itemName;
    const formItemRarity = req.body.itemRarity;

    // check if item exists first. if it does, then return an error saying that it already exists in the database
    const foundItemCheck = await db.findItem(formItemName, formItemRarity);
    if (foundItemCheck) {
      return res.status(400).render("createForm", {
        validationErr: false,
        itemExistsErr: true,
        formType,
        prevInput,
      });
    }
    
    const result = validationResult(req);

    // if there are errors, send error response
    if (!result.isEmpty()) {
      return res.status(400).render("createForm", {
        validationErr: true,
        itemExistsErr: false,
        formType,
        prevInput,
        validationArr: result.array(),
      });
    }

    const data = req.body;

    // add to database if no errors
    await db.addItem(data, formType);

    res.redirect("/");
  },
];

module.exports = {
  renderCreateRoutes,
  renderCreateForm,
  addWeapon,
  addUtility,
  addConsumable,
};
