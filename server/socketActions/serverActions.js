/* Actions that server will send to a client */

// Emitted to user when socket connection is accepted by server
const SERVER_CONNECTION_SUCCESS = 'SERVER_CONNECTION_SUCCESS';

// Emitted to room when new user joins room
const SERVER_NEW_ROOM_MEMBER = 'SERVER_NEW_ROOM_MEMBER';

// Server emits to everyone in room if new message from any user
const SERVER_NEW_ROOM_MESSAGE = 'SERVER_NEW_ROOM_MESSAGE';

module.exports = {
  SERVER_CONNECTION_SUCCESS,
  SERVER_NEW_ROOM_MEMBER,
  SERVER_NEW_ROOM_MESSAGE,
};
