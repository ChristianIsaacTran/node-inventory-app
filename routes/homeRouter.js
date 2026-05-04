const {Router} = require("express");
const homeController = require("../controllers/homeController");

const homeRouter = Router();

// base homepage render
homeRouter.get("/", homeController.renderHome);



module.exports = homeRouter;