const connect = require("../db");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  await connect();
  const { email, password } = req.body;

  const user = await User.findOne({ email, verified: true });
  if (!user) return res.status(400).json({ message: "User not found" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
};
