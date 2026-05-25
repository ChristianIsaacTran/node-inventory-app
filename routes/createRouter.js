const {Router} = require("express");
const createController = require("../controllers/createController");

const createRouter = Router();


createRouter.get("/", createController.renderCreateForm);



module.exports = createRouter;