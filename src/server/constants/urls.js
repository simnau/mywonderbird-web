const config = require('config');

const { clientId, region, domain } = config.get('aws.cognito');
const { apiUrl, groupId } = config.get('mailerlite');

const AWS_COGNITO_OAUTH_URL = `https://${domain}.auth.${region}.amazoncognito.com`;
const AWS_COGNITO_AUTHORIZE_URL = `${AWS_COGNITO_OAUTH_URL}/oauth2/authorize?response_type=code&client_id=${clientId}`;
const AWS_COGNITO_TOKEN_URL = `${AWS_COGNITO_OAUTH_URL}/oauth2/token`;

const MAILERLITE_GROUP_SUBSCRIBERS_URL = `${apiUrl}/groups/${groupId}/subscribers`;

module.exports = {
  AWS_COGNITO_OAUTH_URL,
  AWS_COGNITO_AUTHORIZE_URL,
  AWS_COGNITO_TOKEN_URL,
  MAILERLITE_GROUP_SUBSCRIBERS_URL,
};
