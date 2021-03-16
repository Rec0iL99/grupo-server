const { checkToken } = require('../utils/socketUtils');

// Socket middleware to authenticate socket connection request
const checkAuth = (socket, next) => {
  try {
    // Format -> Bearer accessToken
    const accessToken = socket.handshake.headers.authorization.split(' ')[1];
    const payload = checkToken(accessToken);

    // Constructing the user object with only necessary properties
    const user = {
      email: payload.email,
      username: payload.username,
      name: payload.name,
      profilePic: payload.profilePic,
      profileLink: payload.profileLink,
    };

    if (payload) {
      /* eslint-disable */
      socket.handshake.headers.user = user;
      next();
    } else {
      throw new Error('User not authorized');
    }
  } catch (error) {
    // This will send error back to client
    next(error);
  }
};

module.exports = { checkAuth };
