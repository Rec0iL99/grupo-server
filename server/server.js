// imports
/* eslint-disable global-require */
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const os = require('os');
const mongoose = require('mongoose');

// Route imports
const mainRouter = require('./routes/main');

const PORT = process.env.SERVER_PORT || 5000;

// Connecting to the database
(async () => {
  try {
    await mongoose.connect(process.env.TEST_DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to DB successfully');
  } catch (error) {
    console.log('Failed to establish connection with DB', error);
  }
})();

const app = express();

// Adding the routes to server
app.use('/', mainRouter);

const server = app.listen(PORT, () => {
  const host = os.hostname();
  console.log('Server started at ', host, ':', server.address().port);
});
