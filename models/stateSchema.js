const mongoose = require("mongoose");

const statesSchema = new mongoose.Schema(
  {
    state: String,
    image: String,
  },
  { timestamps: true }
);

const statesCollection = mongoose.model("States", statesSchema);

module.exports = statesCollection;
