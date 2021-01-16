// imports
/* eslint-disable global-require */
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const os = require('os');

const PORT = process.env.SERVER_PORT || 5000;

const app = express();

const server = app.listen(PORT, () => {
  const host = os.hostname();
  console.log('Server started at ', host, ':', server.address().port);
});
