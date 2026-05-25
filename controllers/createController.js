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

  res.render("createForm", { formType, prevInput });
}


async function postCreateForm(req, res) {
  console.log("form submitting attempt");

  res.send("send attempt");
}


module.exports = {
  renderCreateRoutes,
  renderCreateForm,
  postCreateForm,
};
