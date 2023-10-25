const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: String,
  last_name: String, 
  login: String, 
  email: String,
  passwordHash: String,
  refreshToken: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;