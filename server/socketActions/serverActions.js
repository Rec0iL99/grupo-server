/* Actions that server will send to a client */

// Emitted to room when new user joins room
const SERVER_NEW_ROOM_MEMBER = 'SERVER_NEW_ROOM_MEMBER';

// Server emits to everyone in room if new message from any user
const SERVER_NEW_ROOM_MESSAGE = 'SERVER_NEW_ROOM_MESSAGE';

module.exports = {
  SERVER_NEW_ROOM_MEMBER,
  SERVER_NEW_ROOM_MESSAGE,
};
