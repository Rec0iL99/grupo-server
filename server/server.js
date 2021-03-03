/* eslint-disable global-require */
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// Creating express app
const express = require('express');
const app = express();

// Creating the http server
const server = require('http').createServer(app);

// Importing socket-io by passing http server to make express and socket.io to run on same port
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
const os = require('os');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const uuid = require('uuid');

// Route imports
const mainRouter = require('./routes/main');
const usersRouter = require('./routes/users');

const {
  CLIENT_CONNECTION,
  CLIENT_JOIN_ROOM,
  CLIENT_ROOM_MESSAGE,
  CLIENT_CREATE_ROOM,
} = require('./socketActions/clientActions');
const {
  SERVER_JOIN_ROOM,
  SERVER_ROOM_MESSAGE,
} = require('./socketActions/serverActions');
const SERVER_RESPONSE = require('./utils/serverResponses');

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

server.listen(PORT, () => {
  const host = os.hostname();
  console.log('Server started at ', host, ':', server.address().port);
});

const rooms = {};

io.on(CLIENT_CONNECTION, (socket) => {
  console.log('A user connected');

  socket.on(CLIENT_CREATE_ROOM, (roomName, username, callback) => {
    const roomCode = uuid.v4();
    const newRoon = {
      config: {
        roomName: roomName,
        admin: username,
        roomCode,
      },
      users: {},
    };
    socket.join(roomCode);
    newRoon.users[socket.id] = username;
    rooms[roomCode] = newRoon;
    socket.to(roomCode).broadcast.emit(SERVER_JOIN_ROOM, username);
    console.log(rooms);
    callback(SERVER_RESPONSE.ROOM_CREATION_SUCCESS);
  });

  socket.on(CLIENT_JOIN_ROOM, (roomCode, username) => {
    console.log('running');
    if (roomCode in rooms) {
      socket.join(roomCode);
      rooms[roomCode].users[socket.id] = username;
      socket.to(roomCode).broadcast.emit(SERVER_JOIN_ROOM, username);
      console.log(rooms);
    }
  });

  socket.on(CLIENT_ROOM_MESSAGE, (room, message) => {
    socket.to(room).broadcast.emit(SERVER_ROOM_MESSAGE, {
      message: message,
      name: rooms[room].users[socket.id],
    });
  });
});
