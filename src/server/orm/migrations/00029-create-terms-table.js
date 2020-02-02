const {
  TERMS_OF_SERVICE_TYPE,
  PRIVACY_POLICY_TYPE,
} = require('../../constants/terms');

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('terms', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      type: {
        type: Sequelize.ENUM(PRIVACY_POLICY_TYPE, TERMS_OF_SERVICE_TYPE),
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('terms');
  },
};
