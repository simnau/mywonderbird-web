const config = require('config');
const axios = require('axios');
const qs = require('qs');
const jwt = require('jsonwebtoken');

const { USER_ROLE } = require('../../constants/roles');
const userService = require('../user/service');
const {
  AWS_COGNITO_AUTHORIZE_URL,
  AWS_COGNITO_TOKEN_URL,
} = require('../../constants/urls');

const { clientId } = config.get('aws.cognito');

function getAuthorizeUrl() {
  return AWS_COGNITO_AUTHORIZE_URL;
}

async function login(code, redirectUri) {
  const { data: result } = await axios.post(
    AWS_COGNITO_TOKEN_URL,
    qs.stringify({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      redirect_uri: redirectUri,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  const { access_token: accessToken } = result;
  const { username } = jwt.decode(accessToken);
  const user = await userService.getUser(username);
  let { role } = user;

  if (!user.registered || user.registered !== 'true') {
    throw new Error('User has not signed up yet');
  }

  if (!role) {
    await userService.updateUserRole(username, USER_ROLE);
    role = USER_ROLE;
  }

  return {
    accessToken: result.access_token,
    refreshToken: result.refresh_token,
    role,
  };
}

async function register(code, redirectUri) {
  const { data: result } = await axios.post(
    AWS_COGNITO_TOKEN_URL,
    qs.stringify({
      grant_type: 'authorization_code',
      client_id: clientId,
      code,
      redirect_uri: redirectUri,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  const { access_token: accessToken } = result;
  const { username } = jwt.decode(accessToken);
  const user = await userService.getUser(username);
  let { role } = user;

  if (user.registered && user.registered === 'true') {
    throw new Error('User has already signed up');
  } else {
    await userService.markUserAsRegistered(username);
  }

  if (!role) {
    await userService.updateUserRole(username, USER_ROLE);
    role = USER_ROLE;
  }

  return {
    accessToken: result.access_token,
    refreshToken: result.refresh_token,
    role,
  };
}

module.exports = {
  getAuthorizeUrl,
  login,
  register,
};
