const {
  createLogger,
  transports,
  format: {
    printf,
    timestamp,
    combine,
  },
} = require('winston');

const format = printf(({ level, message, timestamp: timestampValue }) => {
  return `${timestampValue} ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    format,
  ),
  transports: [
    new transports.Console(),
  ],
});

module.exports = logger;
