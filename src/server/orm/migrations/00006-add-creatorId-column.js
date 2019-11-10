module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('journeys', 'creatorId', Sequelize.STRING);
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropColumns('journeys', 'creatorId');
  },
};
