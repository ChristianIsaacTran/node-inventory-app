const { Router } = require("express");
const updateController = require("../controllers/updateController");

const updateRouter = Router();

updateRouter.get("/", updateController.renderUpdateForm);

updateRouter.post("/weapon/:category", updateController.updateWeapon);

updateRouter.post("/consumable/:category", updateController.updateConsumable);

updateRouter.post("/utility/:category", updateController.updateUtility);

module.exports = updateRouter;
