const db = require("../db/dbQueries");

const {body, matchedData, validationResult} = require("express-validator");

// on initial update path, use query params to find and display current db info on found item in a form.
async function renderUpdateForm(req, res) {
    const itemName = req.query.name;
    const itemRarity = req.query.rarity;

    // foundItem is an object that contains the rows array (recordArr) and the item's category (itemCategory)
    const foundItem = await db.findItem(itemName, itemRarity);

    console.log(foundItem);

    res.render("update", {item: foundItem.recordArr[0], category: foundItem.itemCategory});
}

// on POST request upon form submission, send the update info for the item being updated to the database and redirect back to home route
async function updateItemPost(req, res) {
    console.log("test");

    res.redirect("/");
}

module.exports = { renderUpdateForm, updateItemPost };