const { Router } = require("express");
const updateController = require("../controllers/updateController");

const updateRouter = Router();

updateRouter.get("/", updateController.renderUpdateForm);

updateRouter.post("/", (req, res) => {
    console.log("placeholder");
});

module.exports = updateRouter;
