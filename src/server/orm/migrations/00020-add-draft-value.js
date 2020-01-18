const { Journey } = require('../models/journey');

module.exports = {
  up(queryInterface, Sequelize) {
    return Journey.update({ draft: false }, { where: {} });
  },
  down(queryInterface, Sequelize) {
    return Journey.update({ draft: null }, { where: {} });
  },
};
