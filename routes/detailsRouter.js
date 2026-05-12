const {Router} = require("express");
const detailsController = require("../controllers/detailsController");

const detailsRouter = Router();

// display details through query parameters
detailsRouter.get("/", detailsController.displayDetails);

module.exports = detailsRouter;