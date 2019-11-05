const fetch = require('node-fetch');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const config = require('config');
const jwt = require('jsonwebtoken');

const cognito = require('../../setup/cognito');
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

function sendConfirmationCode(email, callback) {
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: email,
    Pool: userPool,
  });

  cognitoUser.resendConfirmationCode((err, result) => {
    if (err) {
      return callback(err);
    }

    return callback(null, result);
  });
}

function confirm(email, code, callback) {
  const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: email,
    Pool: userPool,
  });

  cognitoUser.confirmRegistration(code, false, (err, result) => {
    if (err) {
      return callback(err);
    }

    return callback(null, result);
  });
}

async function login(email, password) {
  const {
    idToken,
    ...result
  } = await cognitoUtil.authenticateUser(email, password);

  const { 'custom:role': role } = jwt.decode(idToken);

  return {
    ...result,
    role,
  }
}

module.exports = {
  register,
  sendConfirmationCode,
  confirm,
  login,
};
