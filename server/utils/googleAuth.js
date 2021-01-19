const googleAuthLibrary = require('google-auth-library');

const { OAuth2Client } = googleAuthLibrary;

// Google client id
const clientID = process.env.GOOGLE_CLIENT_ID;

const oAuthClient = new OAuth2Client(clientID);

const googleAuth = async (accessToken) => {
  const ticket = await oAuthClient.verifyIdToken({
    idToken: accessToken,
    audience: clientID,
  });
  const payload = ticket.getPayload();
  if (payload.aud !== clientID) {
    throw new Error('Invalid token signature');
  } else {
    return payload;
  }
};

module.exports = googleAuth;
