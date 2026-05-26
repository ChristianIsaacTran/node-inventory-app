const {Router} = require("express");
const createController = require("../controllers/createController");

const createRouter = Router();

// choose type of item to add
createRouter.get("/", createController.renderCreateRoutes);

// render different form based on item route
createRouter.get("/:formType", createController.renderCreateForm);

// handle form submission validation and db operation in controller
createRouter.post("/weapon", createController.addWeapon);
createRouter.post("/consumable", createController.addConsumable);
createRouter.post("/utility", createController.addUtility);


module.exports = createRouter;