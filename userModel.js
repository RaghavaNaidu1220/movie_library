const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true }, 
  password: String,
  publicPlaylist: [String],
  privatePlaylist: [String]
});

const User = mongoose.model("User", userSchema);

module.exports = {User};
