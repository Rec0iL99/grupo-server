const SERVER_RESPONSE = require('../utils/serverResponses');
const User = require('../models/user');
const {
  getRefreshToken,
  getCookieOptions,
  getUserNameToken,
  getAccessToken,
  verifyToken,
} = require('../utils/auth');

// Destructing array containing secrets for refresh and access token
const [ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET] = [
  process.env.ACCESS_TOKEN_SECRET,
  process.env.REFRESH_TOKEN_SECRET,
];

const authRequest = async (req, res, next) => {
  try {
    // Extracting the tokens from header and cookies
    let accessToken = req.headers.authorization.split(' ')[1];
    const refreshToken = req.cookies.grupo_rtk;
    const userNameToken = req.cookies.grupo_u;

    let payload;

    // Getting the username from username token
    let username;
    try {
      username = verifyToken(userNameToken, ACCESS_TOKEN_SECRET).username;
    } catch (error) {
      throw new Error('Token not provided');
    }

    // Verifing accessToken
    try {
      payload = verifyToken(accessToken, ACCESS_TOKEN_SECRET + username);
    } catch (error) {
      if (error !== 'jwt expired') {
        res.clearCookie('grupo_rtk');
        res.clearCookie('grupo_u');
        throw new Error('Token man handled');
      }
    }

    // If jwt expired
    if (!payload) {
      const user = await User.findOne({ username });

      payload = verifyToken(refreshToken, REFRESH_TOKEN_SECRET + user.password);

      // if refresh token is invalid
      if (!payload) {
        throw new Error('Auth Failed');
      }

      // Create new accessToken and refreshToken
      accessToken = getAccessToken(user);
      res.cookie(
        'grupo_rtk',
        getRefreshToken(user),
        getCookieOptions(604800000)
      );
      res.cookie(
        'grupo_u',
        getUserNameToken(user),
        getCookieOptions(604800000)
      );
    }

    // Giving new accessToken and user json object (payload) for use
    req.accessToken = accessToken;
    req.payload = payload;

    // Moving on to the next set of middlewares
    next();
  } catch (error) {
    res.status(401).json({
      status: false,
      payload: {
        message: SERVER_RESPONSE.AUTHERROR,
      },
    });
  }
};

module.exports = authRequest;
