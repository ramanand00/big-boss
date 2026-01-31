const connect = require("../db");
const User = require("../models/User");

module.exports = async (req, res) => {
  await connect();
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  user.verified = true;
  user.otp = null;
  await user.save();

  res.json({ message: "Verified" });
};
