/* Actions that server will send to a client */

// Emitted to room when new user joins room
const SERVER_JOIN_ROOM = 'SERVER_JOIN_ROOM';

// Server emits to everyone in room if new message from any user
const SERVER_ROOM_MESSAGE = 'SERVER_ROOM_MESSAGE';

// Server emits to everyone in room if something changes in room eg. someone new joins room
const SERVER_ROOM_UPDATED = 'SERVER_ROOM_UPDATED';

module.exports = {
  SERVER_JOIN_ROOM,
  SERVER_ROOM_MESSAGE,
};
