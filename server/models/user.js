const mongoose = require('mongoose');

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  issuer: {
    type: String,
    required: true,
  },
  signupType: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    required: true,
  },
  profileLink: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', user);
