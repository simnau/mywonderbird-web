module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('places', 'deletedAt', {
      type: Sequelize.DATE,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('places', 'deletedAt');
  },
};
