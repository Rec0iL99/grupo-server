/* Actions that client will send to socket server */

// Client establishes conenction with socket server
const CLIENT_CONNECTION = 'connection';

// Client sends req to join room
const CLIENT_JOIN_ROOM = 'CLIENT_JOIN_ROOM';

// Client sends chat message to room
const CLIENT_ROOM_MESSAGE = 'CLIENT_ROOM_MESSAGE';

// Client sends req to create new room
const CLIENT_CREATE_ROOM = 'CLIENT_CREATE_ROOM';

module.exports = {
  CLIENT_CONNECTION,
  CLIENT_JOIN_ROOM,
  CLIENT_ROOM_MESSAGE,
  CLIENT_CREATE_ROOM,
};
