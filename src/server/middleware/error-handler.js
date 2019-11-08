const logger = require('../util/logger');

module.exports = (err, req, res, next) => {
  logger.error(err.message);

  res.status(err.status || 500).send({
    error: err.message || err,
  });
};
