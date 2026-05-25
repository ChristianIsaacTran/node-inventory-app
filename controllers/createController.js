const { render } = require("ejs");

async function renderCreateForm(req, res) {
    res.render("create", {});
}

module.exports = {renderCreateForm};