const config = require('config');

const { clientId, region, domain } = config.get('aws.cognito');
const { apiUrl, webGroupId, newsletterGroupId } = config.get('mailerlite');

const AWS_COGNITO_OAUTH_URL = `https://${domain}.auth.${region}.amazoncognito.com`;
const AWS_COGNITO_AUTHORIZE_URL = `${AWS_COGNITO_OAUTH_URL}/oauth2/authorize?response_type=code&client_id=${clientId}`;
const AWS_COGNITO_TOKEN_URL = `${AWS_COGNITO_OAUTH_URL}/oauth2/token`;

const MAILERLITE_WEB_GROUP_SUBSCRIBERS_URL = `${apiUrl}/groups/${webGroupId}/subscribers`;
const MAILERLITE_NEWSLETTER_GROUP_SUBSCRIBERS_URL = `${apiUrl}/groups/${newsletterGroupId}/subscribers`;
const MAILERLITE_UNSUBSCRIBE_URL = email => `${apiUrl}/subscribers/${email}`;

module.exports = {
  AWS_COGNITO_OAUTH_URL,
  AWS_COGNITO_AUTHORIZE_URL,
  AWS_COGNITO_TOKEN_URL,
  MAILERLITE_WEB_GROUP_SUBSCRIBERS_URL,
  MAILERLITE_NEWSLETTER_GROUP_SUBSCRIBERS_URL,
  MAILERLITE_UNSUBSCRIBE_URL,
};
