const express = require('express');

const mainRouter = express.Router();

mainRouter.get('/', (req, res) => {
  res.send('Grupo server is up and running');
});

module.exports = mainRouter;
