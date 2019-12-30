const fetch = require('node-fetch');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const config = require('config');
const jwt = require('jsonwebtoken');

const {
  FORCE_CHANGE_PASSWORD_STATUS,
  NOT_AUTHORIZED,
  FORCE_CHANGE_PASSWORD,
} = require('../../constants/cognito');
const cognitoUtil = require('../../util/cognito');

global.fetch = fetch;

const { poolId, clientId } = config.get('aws.cognito');

const userPool = new AmazonCognitoIdentity.CognitoUserPool({
  UserPoolId: poolId,
  ClientId: clientId,
});

function register(email, password) {
  return cognitoUtil.registerUser(email, password);
}

function sendConfirmationCode(email) {
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: email,
    Pool: userPool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        return reject(err);
      }

      return resolve(result);
    });
  });
}

function confirm(email, code) {
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: email,
    Pool: userPool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, false, (err, result) => {
      if (err) {
        return reject(err);
      }

      return resolve(result);
    });
  });
}

async function login(email, password) {
  const user = await cognitoUtil.getUser(email);

  if (user.status === FORCE_CHANGE_PASSWORD_STATUS) {
    const error = new Error('The account needs its password changed');
    error.code = FORCE_CHANGE_PASSWORD;
    throw error;
  }

  const { idToken, ...result } = await cognitoUtil.authenticateUser(
    email,
    password,
  );

  const { 'custom:role': role } = jwt.decode(idToken);

  return {
    ...result,
    role,
    provider: 'Cognito',
  };
}

async function refreshToken(token) {
  return cognitoUtil.refreshToken(token);
}

async function forgotPassword(email) {
  return cognitoUtil.forgotPassword(email);
}

async function resetPassword(email, password, code) {
  return cognitoUtil.resetPassword(email, password, code);
}

async function changePassword(email, currentPassword, newPassword) {
  try {
    await cognitoUtil.authenticateUser(email, currentPassword);
    return cognitoUtil.changePassword(email, newPassword);
  } catch (e) {
    if (e.code && e.code === NOT_AUTHORIZED) {
      const error = new Error('Incorrect current password');
      error.code = e.code;
      throw error;
    }

    throw e;
  }
}

async function forceChangePassword(email, currentPassword, newPassword) {
  await cognitoUtil.forceChangePassword(email, currentPassword, newPassword);
}

async function createTemporaryPassword(email) {
  return cognitoUtil.createTemporaryPassword(email);
}

module.exports = {
  register,
  sendConfirmationCode,
  confirm,
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  forceChangePassword,
  createTemporaryPassword,
};
