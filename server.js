// npm init -y
// npm i express
// npm i mongoose
// npm i ejs
// npm i method-override
// npm i dotenv

//___________________
//Dependencies
//___________________
const express = require("express");
// const methodOverride = require("method-override");
const mongoose = require("mongoose");
// grabbing only env file in current directory
const env = require("dotenv").config({ path: ".env" });
const trailsController = require("./controller/trails");
const PORT = process.env.PORT || 3000;

// config
const app = express();
const db = mongoose.connection;

//use public folder for static assets *** still dont know why this needs to be here ***
app.use(express.static("public"));

//Database

// connect to the database either via heroku/atlas
// const MONGODB_URI = process.env.MONGODB_URI;

// local
const mongoURI = "mongodb://0.0.0.0:27017/trails";

// Connect to Mongo atlas
// mongoose.connect(MONGODB_URI, () => {
//   console.log("connected to mongo");
// });

// connect local
mongoose.connect(mongoURI, () => {
  console.log("connected to mongo");
});

// Error / success / mongo atlas
// db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
// db.on("connected", () => console.log("mongo connected: ", MONGODB_URI));
// db.on("disconnected", () => console.log("mongo disconnected"));

// Error / success / mongo local
db.on("error", (err) => console.log(err.message + " is Mongod not running?"));
db.on("connected", () => console.log("mongo connected: ", mongoURI));
db.on("disconnected", () => console.log("mongo disconnected"));

// using routes from controller

// change to /trailblazer as default
app.use("/", trailsController);

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log("Listening on port:", PORT));
