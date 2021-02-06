const express = require('express');
const authRequest = require('../middlewares/authRequest');
const {
  signUpUser,
  loginUser,
  logoutUser,
} = require('../controllers/userController');

const usersRouter = express.Router();

usersRouter.post('/signup', signUpUser);
usersRouter.post('/login', loginUser);
usersRouter.get('/logout', authRequest, logoutUser);

module.exports = usersRouter;