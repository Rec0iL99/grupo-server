const mongoose = require('mongoose');

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  issuer: {
    type: String,
    required: true,
  },
  signUpType: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', user);
