const jwt = require('jsonwebtoken');

// Destructing array containing secrets for refresh and access token
const [
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY_TIME,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY_TIME,
] = [
  process.env.ACCESS_TOKEN_SECRET,
  process.env.ACCESS_TOKEN_EXPIRY_TIME,
  process.env.REFRESH_TOKEN_SECRET,
  process.env.REFRESH_TOKEN_EXPIRY_TIME,
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
    { expiresIn: ACCESS_TOKEN_EXPIRY_TIME }
  );
  return accessToken;
};

const getRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    {
      email: user.email,
      username: user.username,
    },
    REFRESH_TOKEN_SECRET + user.username,
    { expiresIn: REFRESH_TOKEN_EXPIRY_TIME }
  );
  return refreshToken;
};

const getUserNameToken = (user) => {
  const userNameToken = jwt.sign(
    { email: user.username },
    ACCESS_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY_TIME }
  );
  return userNameToken;
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

const getCookieOptions = (TTL) => ({
  maxAge: TTL,
  httpOnly: true,
  secure: process.env.NODE_ENV !== 'development',
  sameSite: 'None',
});

module.exports = {
  getAccessToken,
  getRefreshToken,
  getUserNameToken,
  verifyToken,
  getCookieOptions,
};
