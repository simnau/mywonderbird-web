const Analytics = require('analytics-node');
const config = require('config');

const logger = require('./logger');
const events = require('../constants/analytics');

const { writeKey } = config.get('segment');

const analytics = new Analytics(writeKey);

async function trackLogin(userId) {
  try {
    analytics.track({
      userId,
      event: events.LOGIN,
      properties: {
        category: 'Account',
      },
    });
  } catch (e) {
    logger.error(e.message);
  }
}

module.exports = {
  trackLogin,
};
