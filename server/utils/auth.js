const jwt = require('jsonwebtoken');

// Destructing array containing secrets for refresh and access token
const [ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET] = [
  process.env.ACCESS_TOKEN_SECRET,
  process.env.REFRESH_TOKEN_SECRET,
];

const getAccessToken = (user) => {
  const accessToken = jwt.sign(
    {
      email: user.email,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
    },
    ACCESS_TOKEN_SECRET + user.username,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY_TIME }
  );
  return accessToken;
};

const getRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    {
      email: user.email,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
    },
    REFRESH_TOKEN_SECRET + user.username,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY_TIME }
  );
  return refreshToken;
};

const verifyToken = (token, key) => {
  try {
    const payload = jwt.verify(token, key);
    return payload;
  } catch (error) {
    if (error.message !== 'jwt expired') {
      throw new Error(error.message);
    }
    return false;
  }
};

module.exports = { getAccessToken, getRefreshToken, verifyToken };
