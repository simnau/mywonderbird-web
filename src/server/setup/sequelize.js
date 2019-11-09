const Sequelize = require('sequelize');
const config = require('config');

const logger = require('../util/logger');

const { url } = config.get('database');

module.exports = new Sequelize(url, {
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  logging: logger.info,
});
