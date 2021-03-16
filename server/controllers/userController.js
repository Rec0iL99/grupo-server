const bcrypt = require('bcrypt');
const User = require('../models/user');
const {
  getRefreshToken,
  getCookieOptions,
  getUserNameToken,
  getAccessToken,
  verifyToken,
} = require('../utils/auth');
const githubAuth = require('../utils/githubAuth');
const SERVER_RESPONSE = require('../utils/serverResponses');

// Sign up new user to grupo
const signUpUser = (req, res) => {
  try {
    if (req.body.issuer === 'github') {
      githubAuth(req.body.accessCode)
        .then((response) => {
          User.find({ email: response.email })
            .exec()
            /* eslint-disable consistent-return */
            .then((user) => {
              if (user.length === 1) {
                return res.status(409).json({
                  status: false,
                  payload: {
                    message: SERVER_RESPONSE.CONFLICT,
                  },
                });
              }
              bcrypt.hash(req.body.password, 10, (error, hashedPassword) => {
                if (error) {
                  console.log(error);
                  throw new Error('Password encryption failed');
                }

                const newUser = new User({
                  username: response.login,
                  name: response.name,
                  email: response.email,
                  password: hashedPassword,
                  issuer: req.body.issuer,
                  signupType: req.body.signupType,
                  profilePic: response.avatar_url,
                  profileLink: response.html_url,
                });

                newUser
                  .save()
                  .then(() => {
                    res.status(201).json({
                      status: true,
                      payload: {
                        message: SERVER_RESPONSE.CREATED,
                      },
                    });
                  })
                  .catch(() => {
                    res.status(406).json({
                      status: false,
                      payload: {
                        message: SERVER_RESPONSE.MISSING,
                      },
                    });
                  });
              });
            })
            .catch(() => {
              res.status(500).json({
                status: false,
                payload: {
                  message: SERVER_RESPONSE.ERROR,
                },
              });
            });
        })
        .catch(() => {
          res.status(401).json({
            status: false,
            payload: {
              message: SERVER_RESPONSE.ERRORTOKEN,
            },
          });
        });
    } else {
      res.status(500).json({
        status: false,
        payload: {
          message: SERVER_RESPONSE.ERROR,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      payload: {
        message: SERVER_RESPONSE.ERROR,
      },
    });
  }
};

// Login user to grupo
const loginUser = (req, res) => {
  try {
    if (req.body.issuer === 'github') {
      githubAuth(req.body.accessCode)
        .then((response) => {
          User.find({ email: response.email })
            .exec()
            .then((user) => {
              if (user.length >= 1) {
                res.cookie(
                  'grupo_rtk',
                  getRefreshToken(user[0]),
                  getCookieOptions(604800000)
                );
                res.cookie(
                  'grupo_u',
                  getUserNameToken(user[0]),
                  getCookieOptions(604800000)
                );
                res.status(200).json({
                  status: true,
                  payload: {
                    message: SERVER_RESPONSE.LOGIN,
                    accessToken: getAccessToken(user[0]),
                  },
                });
              } else {
                res.status(403).json({
                  status: false,
                  payload: { message: SERVER_RESPONSE.REGISTER },
                });
              }
            })
            .catch((error) => {
              console.log(error);
              res.status(500).json({
                status: false,
                payload: { message: SERVER_RESPONSE.ERROR },
              });
            });
        })
        .catch((error) => {
          console.log(error);
          res.status(401).json({
            status: false,
            payload: { message: SERVER_RESPONSE.ERRORTOKEN },
          });
        });
    } else {
      res.status(500).json({
        status: false,
        payload: {
          message: SERVER_RESPONSE.ERROR,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      payload: {
        message: SERVER_RESPONSE.ERROR,
      },
    });
  }
};

// Precheck for user to make sure refreshToken, accessToken is valid
const preCheckUser = async (req, res) => {
  try {
    // Extracting accessToken from headers passed by client
    let accessToken = req.headers.authorization.split(' ')[1];
    // Extracting userNameToken, refreshToken from cookies
    const refreshToken = req.cookies.grupo_rtk;
    const userNameToken = req.cookies.grupo_u;

    let payload;

    if (!userNameToken) {
      res.status(403).json({
        status: false,
        payload: {
          message: SERVER_RESPONSE.LOGINREQUIRED,
        },
      });
    }

    let username;

    // Extracting username from userNameToken
    try {
      username = verifyToken(userNameToken, process.env.ACCESS_TOKEN_SECRET)
        .username;
    } catch (error) {
      throw new Error('Token Not Provided');
    }

    // Verifying accessToken
    try {
      payload = verifyToken(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET + username
      );
    } catch (error) {
      if (error.message !== 'jwt expired') {
        throw new Error('Token Man Handled');
      }
    }

    // If accessToken verification failed, thats means server has to renew accessToken
    if (!payload) {
      // Getting userData from db
      const user = await User.findOne({ userName: username });

      // Verifying refreshToken
      payload = verifyToken(
        refreshToken,
        process.env.REFRESH_SECRECT_KEY + user.password
      );

      // Both accessToken and refreshToken are invalid
      if (!payload) {
        throw new Error('Auth Failed');
      }

      // Renewing tokens
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

    res.status(200).json({
      status: true,
      payload: {
        message: SERVER_RESPONSE.TOKEN,
        accessToken: accessToken,
      },
    });
  } catch (error) {
    res.clearCookie('grupo_rtk');
    res.clearCookie('grupo_u');
    res.status(401).json({
      status: false,
      payload: {
        message: SERVER_RESPONSE.AUTHERROR,
      },
    });
  }
};

// Logout user from grupo
const logoutUser = (req, res) => {
  try {
    res.clearCookie('grupo_rtk');
    res.clearCookie('grupo_u');
    res.status(200).json({
      status: true,
      payload: {
        message: SERVER_RESPONSE.LOGOUT,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      payload: {
        message: SERVER_RESPONSE.ERROR,
      },
    });
  }
};

module.exports = { signUpUser, loginUser, preCheckUser, logoutUser };
