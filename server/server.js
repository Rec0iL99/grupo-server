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
  SERVER_NEW_ROOM_MEMBER,
  SERVER_NEW_ROOM_MESSAGE,
} = require('./socketActions/serverActions');

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

// The main rooms object (will be using a DB later)
const rooms = {};

io.on(CLIENT_CONNECTION, (socket) => {
  console.log('A user connected');

  socket.on(CLIENT_CREATE_ROOM, (roomName, username, callback) => {
    // Creating unique room code for room
    const roomCode = uuid.v4();
    const newRoom = {
      config: {
        admin: username,
        roomCode,
        roomName,
        roomAvatar:
          'https://visualpharm.com/assets/742/Connect%20Develop-595b40b65ba036ed117d3e66.svg',
      },
      members: [],
      messages: [],
    };
    const newMember = {
      username,
      profilePic: 'https://bit.ly/dan-abramov',
      online: true,
    };
    const newRoomMessage = {
      type: 'room-alert-message',
      username,
      action: 'joined-room',
    };
    // Socket of client joins the room
    socket.join(roomName);
    newRoom.members.push(newMember);
    newRoom.messages.push(newRoomMessage);
    rooms[roomName] = newRoom;
    // socket.to(roomName).broadcast.emit(SERVER_ROOM_UPDATED, rooms[roomName]);
    console.log(rooms);
    // Sending newly created room data back to client on callback
    callback(rooms[roomName]);
  });

  socket.on(CLIENT_JOIN_ROOM, (roomCode, username, callback) => {
    Object.keys(rooms).forEach((roomName) => {
      // Checking if roomCode provided by client is valid
      if (rooms[roomName].config.roomCode === roomCode) {
        // Socket of client joins the room
        socket.join(roomName);
        const newMember = {
          username,
          profilePic: 'https://bit.ly/dan-abramov',
          online: true,
        };
        rooms[roomName].members.push(newMember);
        // Creating a new room alert
        const newRoomMessage = {
          type: 'room-alert-message',
          username,
          action: 'joined-room',
        };
        rooms[roomName].messages.push(newRoomMessage);
        // Broadcasting to other members of new member
        socket.to(roomName).broadcast.emit(SERVER_NEW_ROOM_MEMBER, {
          roomName,
          member: newMember,
        });
        // Broadcasting to other members of new room message
        socket.to(roomName).broadcast.emit(SERVER_NEW_ROOM_MESSAGE, {
          roomName,
          roomMessage: newRoomMessage,
        });
        // Sending newly joined room data back to client on callback
        callback(rooms[roomName]);
      }
    });
  });

  socket.on(
    CLIENT_ROOM_MESSAGE,
    (roomName, username, chatMessage, callback) => {
      // Calculating the date when chatMessage was posted
      const today = new Date();
      const date = `${String(today.getDate()).padStart(2, '0')}/${String(
        today.getMonth() + 1
      ).padStart(2, '0')}/${today.getFullYear()}`;
      const time = `${today.getHours()}:${today.getMinutes()}`;
      const timeOfMessage = `${date} at ${time}`;

      const newRoomMessage = {
        type: 'room-chat-message',
        username,
        firstname: 'defaultFirstName',
        lastname: 'defaultLastName',
        profilePic: 'https://bit.ly/dan-abramov',
        timeOfMessage,
        chatMessage,
      };
      rooms[roomName].messages.push(newRoomMessage);
      socket.to(roomName).broadcast.emit(SERVER_NEW_ROOM_MESSAGE, {
        roomName,
        roomMessage: newRoomMessage,
      });
      callback(newRoomMessage);
    }
  );
});
