const config = require('config');
const axios = require('axios');

const { MAILERLITE_GROUP_SUBSCRIBERS_URL } = require('../../constants/urls');

const { apiKey } = config.get('mailerlite');

async function subscribe(email) {
  const { data } = await axios.post(
    MAILERLITE_GROUP_SUBSCRIBERS_URL,
    {
      email,
    },
    {
      headers: {
        'X-MailerLite-ApiKey': apiKey,
      },
    },
  );

  return data;
}

module.exports = {
  subscribe,
};
