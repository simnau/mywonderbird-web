module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('notifications', 'extraData', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('notifications', 'extraData');
  },
};
