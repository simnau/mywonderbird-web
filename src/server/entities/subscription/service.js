const config = require('config');
const axios = require('axios');

const {
  MAILERLITE_WEB_GROUP_SUBSCRIBERS_URL,
  MAILERLITE_NEWSLETTER_GROUP_SUBSCRIBERS_URL,
} = require('../../constants/urls');

const { apiKey } = config.get('mailerlite');

async function subscribe(email) {
  const { data } = await axios.post(
    MAILERLITE_WEB_GROUP_SUBSCRIBERS_URL,
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

async function subscribeNewsletter(email) {
  const { data } = await axios.post(
    MAILERLITE_NEWSLETTER_GROUP_SUBSCRIBERS_URL,
    {
      email,
      resubscribe: true,
      type: 'active',
    },
    {
      headers: {
        'X-MailerLite-ApiKey': apiKey,
      },
    },
  );

  return data;
}

async function unsubscribeNewsletter(email) {
  const { data } = await axios.post(
    MAILERLITE_NEWSLETTER_GROUP_SUBSCRIBERS_URL,
    { email, type: 'unsubscribed' },
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
  subscribeNewsletter,
  unsubscribeNewsletter,
};
