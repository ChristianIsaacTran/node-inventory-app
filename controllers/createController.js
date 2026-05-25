const { render } = require("ejs");

async function renderCreateRoutes(req, res) {
  res.render("createRoute", {});
}

async function renderCreateForm(req, res) {
    const formType = req.params.formType;

    // keeps user's input fields if form has validation errors
    const prevInput = req.body;

    res.render("createForm", {formType, prevInput});
}

module.exports = {
  renderCreateRoutes,
  renderCreateForm
};
