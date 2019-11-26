const fetch = require('node-fetch');
const config = require('config');
const jwkToPem = require('jwk-to-pem');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const passwordGenerator = require('generate-password');

const { USER_ROLE, ADMIN_ROLE } = require('../constants/roles');
const {
  CUSTOM_ATTRIBUTE_PREFIX,
  ROLE_ATTRIBUTE,
} = require('../constants/cognito');
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

function userToObject(user, attributeField = 'UserAttributes') {
  return user[attributeField].reduce(
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

async function refreshToken(token) {
  const result = await cognito
    .initiateAuth({
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: {
        REFRESH_TOKEN: token,
      },
      ClientId: clientId,
    })
    .promise();

  return {
    accessToken: result.AuthenticationResult.AccessToken,
  };
}

async function registerUser(email, password) {
  return new Promise((resolve, reject) => {
    const attributeList = [
      new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: 'email',
        Value: email,
      }),
      new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: ROLE_ATTRIBUTE,
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

async function createUser(email) {
  const attributeList = [
    {
      Name: 'email',
      Value: email,
    },
    {
      Name: ROLE_ATTRIBUTE,
      Value: USER_ROLE,
    },
  ];
  const password = passwordGenerator.generate({
    length: 10,
    numbers: true,
  });

  const { User: createdUser } = await cognito
    .adminCreateUser({
      UserPoolId: poolId,
      Username: email,
      UserAttributes: attributeList,
      TemporaryPassword: password,
      MessageAction: 'SUPPRESS',
    })
    .promise();

  return userToObject(createdUser, 'Attributes');
}

async function deleteUser(userId) {
  const user = await getUser(userId);

  if (!user) {
    throw new Error(`User with userId ${userId} not found`);
  }

  if (user.role === ADMIN_ROLE) {
    throw new Error('Cannot delete an admin user');
  }

  return cognito
    .adminDeleteUser({ Username: userId, UserPoolId: poolId })
    .promise();
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

async function listUsers(limit, paginationToken, filter) {
  const result = await cognito
    .listUsers({
      Limit: limit,
      PaginationToken: paginationToken,
      AttributesToGet: ['email', ROLE_ATTRIBUTE],
      Filter: filter,
      UserPoolId: poolId,
    })
    .promise();

  const users = result.Users.map(user => userToObject(user, 'Attributes'));

  return {
    users,
    paginationToken: result.PaginationToken,
  };
}

async function forgotPassword(email) {
  const result = await cognito
    .forgotPassword({
      Username: email,
      ClientId: clientId,
    })
    .promise();

  return result;
}

async function resetPassword(email, password, code) {
  const result = await cognito
    .confirmForgotPassword({
      Username: email,
      Password: password,
      ConfirmationCode: code,
      ClientId: clientId,
    })
    .promise();

  return result;
}

module.exports = {
  verifyToken,
  refreshToken,
  getUser,
  registerUser,
  createUser,
  deleteUser,
  authenticateUser,
  listUsers,
  forgotPassword,
  resetPassword,
};
