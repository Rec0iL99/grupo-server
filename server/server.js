// imports
/* eslint-disable global-require */
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const os = require('os');

// Route imports
const mainRouter = require('./routes/main');

const PORT = process.env.SERVER_PORT || 5000;

const app = express();

// Adding the routes
app.use('/', mainRouter);

const server = app.listen(PORT, () => {
  const host = os.hostname();
  console.log('Server started at ', host, ':', server.address().port);
});
