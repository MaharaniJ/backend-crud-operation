const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  name: String,
  qualification: String,
  subject: String,
  age: Number,
});

const User = mongoose.model("UserData", userDataSchema);

module.exports = User;
