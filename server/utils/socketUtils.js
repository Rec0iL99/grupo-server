const jwt = require('jsonwebtoken');

// For verifing token sent in socket headers
const checkToken = (accessToken) => {
  try {
    const decodedToken = jwt.decode(accessToken);
    const payload = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET + decodedToken.username
    );
    return payload;
  } catch (error) {
    return false;
  }
};

module.exports = { checkToken };
