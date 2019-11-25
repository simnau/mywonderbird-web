const logger = require('../util/logger');

module.exports = (err, req, res, next) => {
  logger.error(err.message);

  const errorData = {
    error: err.message || err,
  };

  if (err.code) {
    errorData.code = err.code;
  }

  res.status(err.status || 500).send(errorData);
};
