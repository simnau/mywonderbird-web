module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('journeys', 'published', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('journeys', 'published');
  },
};
