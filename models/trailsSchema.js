const mongoose = require("mongoose");

const trailsSchema = new mongoose.Schema(
  {
    name: String,
    state: String,
    city: String,
    miles: mongoose.Decimal128,
    description: String,
    image: String,
  },
  { timestamps: true }
);

const trailCollection = mongoose.model("Trails", trailsSchema);

module.exports = trailCollection;
