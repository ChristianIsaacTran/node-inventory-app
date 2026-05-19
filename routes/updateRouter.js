const { Router } = require("express");
const updateController = require("../controllers/updateController");

const updateRouter = Router();

updateRouter.get("/", updateController.renderUpdateForm);

updateRouter.post("/", updateController.updateItemPost);

module.exports = updateRouter;
