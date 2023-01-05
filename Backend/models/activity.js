const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const activitySchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
  creater: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

module.exports = mongoose.model("Activity", activitySchema);
