const express = require('express');
const { signUpUser } = require('../controllers/userController');

const usersRouter = express.Router();

usersRouter.post('/signup', signUpUser);

module.exports = usersRouter;
