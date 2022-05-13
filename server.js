// npm init -y
// npm i express
// npm i mongoose
// npm i ejs
// npm i method-override

//___________________
//Dependencies
//___________________
const express = require("express");
// const methodOverride = require("method-override");
const mongoose = require("mongoose");
const trailsController = require("./controllers/trails");
const PORT = process.env.PORT;

// config
const app = express();
const db = mongoose.connection;
require("dotenv").config();

//use public folder for static assets *** still dont know why this needs to be here ***
app.use(express.static("public"));

//Database
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;
// local
// const MONGODB_URI = PORT;

// Connect to Mongo
mongoose.connect(MONGODB_URI, () => {
  console.log("connected to mongo");
});

// Error / success
db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
db.on("connected", () => console.log("mongo connected: ", MONGODB_URI));
db.on("disconnected", () => console.log("mongo disconnected"));

// using routes from controller
app.use("/", trailsController);

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log("Listening on port:", PORT));
