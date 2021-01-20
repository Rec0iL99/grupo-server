const express = require('express');
const { signUpUser, loginUser } = require('../controllers/userController');

const usersRouter = express.Router();

usersRouter.post('/signup', signUpUser);
usersRouter.post('/login', loginUser);

module.exports = usersRouter;
