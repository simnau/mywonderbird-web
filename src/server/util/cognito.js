const fetch = require('node-fetch');
const config = require('config');
const jwkToPem = require('jwk-to-pem');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

const { USER_ROLE } = require('../constants/roles');
const { CUSTOM_ATTRIBUTE_PREFIX } = require('../constants/cognito');
const cognito = require('../setup/cognito');
const jwtUtil = require('./jwt');

global.fetch = fetch;

const { region, poolId, clientId } = config.get('aws.cognito');

const userPool = new AmazonCognitoIdentity.CognitoUserPool({
  UserPoolId: poolId,
  ClientId: clientId,
});

const JWKS_URL = `https://cognito-idp.${region}.amazonaws.com/${poolId}/.well-known/jwks.json`;

async function verifyToken(token) {
  const jwks = await fetch(JWKS_URL).then(result => result.json());
  const pems = jwks.keys.reduce((acc, key) => {
    const { kid: keyId, n: modulus, e: exponent, kty: keyType } = key;
    const jwk = { kty: keyType, n: modulus, e: exponent };
    const pem = jwkToPem(jwk);
    return {
      ...acc,
      [keyId]: pem,
    };
  }, {});

  return jwtUtil.verifyToken(pems, token);
}

function userToObject(user) {
  return user.UserAttributes.reduce(
    (acc, attribute) => {
      const customAttributeIndex = attribute.Name.indexOf(
        CUSTOM_ATTRIBUTE_PREFIX,
      );
      const attributeKey =
        customAttributeIndex !== -1
          ? attribute.Name.substring(
              customAttributeIndex + CUSTOM_ATTRIBUTE_PREFIX.length,
            )
          : attribute.Name;

      return {
        ...acc,
        [attributeKey]: attribute.Value,
      };
    },
    {
      id: user.Username,
    },
  );
}

async function getUser(userId) {
  const user = await cognito
    .adminGetUser({
      Username: userId,
      UserPoolId: poolId,
    })
    .promise();

  return userToObject(user);
}

async function registerUser(email, password) {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: 'email',
        Value: email,
      }),
      new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: 'custom:role',
        Value: USER_ROLE,
      }),
    ];

    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        return reject(err);
      }

      return resolve(result.user);
    });
  });
}

async function authenticateUser(email, password) {
  return new Promise((resolve, reject) => {
    const authenticationDetials = new AmazonCognitoIdentity.AuthenticationDetails(
      {
        Username: email,
        Password: password,
      },
    );

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetials, {
      onSuccess(result) {
        const accessToken = result.getAccessToken().getJwtToken();
        const refreshToken = result.getRefreshToken().getToken();
        const idToken = result.getIdToken().getJwtToken();
        resolve({
          accessToken,
          refreshToken,
          idToken,
        });
      },
      onFailure(err) {
        reject(err);
      },
    });
  });
}

module.exports = {
  verifyToken,
  getUser,
  registerUser,
  authenticateUser,
};
