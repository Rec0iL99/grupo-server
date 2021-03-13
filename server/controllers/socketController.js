const { checkToken } = require('../utils/socketUtils');

// Socket middleware to authenticate socket connection request
const checkAuth = (socket, next) => {
  try {
    // Format -> Bearer accessToken
    const accessToken = socket.handshake.headers.authorization.split(' ')[1];
    const payload = checkToken(accessToken);

    if (payload) {
      /* eslint-disable */
      socket.handshake.headers.user = payload;
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
