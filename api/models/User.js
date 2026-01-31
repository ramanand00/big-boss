const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  contact: String,
  otp: String,
  verified: { type: Boolean, default: false },
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
