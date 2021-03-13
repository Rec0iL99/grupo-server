// Object that contains all users currently connected to socket server
const users = {};

// Adding newly connected users to users object
const addUser = (socket, user) => {
  try {
    if (!users[user.username]) {
      console.log(`${user.username} connected`);
      users[user.username] = {
        socketID: socket.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        profilePic: user.profilePic,
      };
    } else {
      console.log(`${user.username} reconnected`);
      users[user.username].socketID = socket.id;
    }
    return users[user.username];
  } catch (error) {
    return false;
  }
};

module.exports = { addUser };
