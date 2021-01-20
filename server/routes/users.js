const express = require('express');
const {
  signUpUser,
  loginUser,
  logoutUser,
} = require('../controllers/userController');

const usersRouter = express.Router();

usersRouter.post('/signup', signUpUser);
usersRouter.post('/login', loginUser);
usersRouter.get('/logout', logoutUser);

module.exports = usersRouter;
