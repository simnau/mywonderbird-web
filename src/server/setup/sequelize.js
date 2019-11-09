const Sequelize = require('sequelize');
const config = require('config');

const { url } = config.get('database');

console.log('Database URL:', url);

module.exports = new Sequelize(url, {
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  logging: console.log,
});
