const { Profile } = require('../models/profile');

// This probably should've been a one-of task
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('profiles', 'providerId', {
      type: Sequelize.STRING,
      defaultValue: Sequelize.UUIDV4,
      unique: true,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('profiles', 'providerId');
  },
};
