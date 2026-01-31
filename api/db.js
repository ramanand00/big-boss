const mongoose = require("mongoose");

let cached = global.mongoose || { conn: null };

module.exports = async () => {
  if (!cached.conn) {
    cached.conn = await mongoose.connect(process.env.MONGO_URI);
  }
  return cached.conn;
};
