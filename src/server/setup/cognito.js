const AWS = require('aws-sdk');
const config = require('config');

const {
  accessKey,
  secretKey,
  cognito: { region },
} = config.get('aws');

const cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
  region,
});

module.exports = cognitoIdentityServiceProvider;
