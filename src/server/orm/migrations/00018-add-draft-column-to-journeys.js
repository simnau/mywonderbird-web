module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('journeys', 'draft', {
      type: Sequelize.BOOLEAN,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('journeys', 'draft');
  },
};
