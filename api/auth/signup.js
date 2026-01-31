const connect = require("../db");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

module.exports = async (req, res) => {
  await connect();
  const { name, email, password, contact } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await User.create({
    name,
    email,
    contact,
    password: await bcrypt.hash(password, 10),
    otp,
  });

  console.log("OTP:", otp); // replace with nodemailer

  res.json({ message: "OTP sent" });
};
