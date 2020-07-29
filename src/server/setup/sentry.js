if (process.env.NODE_ENV !== 'development') {
  const config = require('config');
  const Sentry = require('@sentry/node');

  const dsn = config.get('sentry.dsn');

  Sentry.init({ dsn });
}
