/* eslint-disable global-require */
if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require('express');
const os = require('os');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Route imports
const mainRouter = require('./routes/main');
const usersRouter = require('./routes/users');

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

app.use(express.json());

app.use(cookieParser());

// Adding cors options and whitelisting the client url
const whitelist = ['http://localhost:3000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS.'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Adding the routes to server
app.use('/', mainRouter);
app.use('/users', usersRouter);

const server = app.listen(PORT, () => {
  const host = os.hostname();
  console.log('Server started at ', host, ':', server.address().port);
});
