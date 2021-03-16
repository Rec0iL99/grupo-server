const superagent = require('superagent');

const githubAuth = async (accessCode) => {
  // Requesting for an accessToken from github API
  const responseFromAccessCode = await superagent
    .post(process.env.GITHUB_ACCESS_TOKEN_API)
    .send({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: accessCode,
    })
    .set('Accept', 'application/json');

  // Extracting the accessToken
  const githubAccessToken = await responseFromAccessCode.body.access_token;

  if (!githubAccessToken) {
    throw new Error('Invalid Github Access Code');
  }

  // Requesting for user API using accessToken from github API
  const responseFromAccessToken = await superagent
    .get(process.env.GITHUB_USER_INFO_API)
    .set('Authorization', `token ${githubAccessToken}`)
    .set('User-Agent', 'grupo');

  // Extracting user info from github
  const githubUser = await responseFromAccessToken.body;

  if (!githubUser) {
    throw new Error('Invalid GitHub Access Token');
  } else {
    return githubUser;
  }
};

module.exports = githubAuth;
