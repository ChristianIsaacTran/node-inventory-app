const express = require("express");
const path = require("node:path");
const homeRouter = require("./routes/homeRouter");
const detailsRouter = require("./routes/detailsRouter");
const deleteRouter = require("./routes/deleteRouter");
const updateRouter = require("./routes/updateRouter");
const createRouter = require("./routes/createRouter");

const app = express();

const viewsPath = path.join(__dirname, "views");
app.set("view engine", "ejs");
app.set("views", viewsPath);

app.use(express.urlencoded({ extended: true }));

const staticPath = path.join(__dirname, "public");
app.use(express.static(staticPath));

// routers and routes
app.use("/", homeRouter);
app.use("/create", createRouter); //create
app.use("/details", detailsRouter);  //read
app.use("/update", updateRouter); //update
app.use("/delete", deleteRouter); //delete



const currentPort = process.env.PORT || 3000;

app.listen(currentPort, (error) => {
  if (error) {
    return new Error("Error" + error);
  }

  console.log("Server has been started.");
});
