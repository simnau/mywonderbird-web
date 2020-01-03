module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addConstraint(
      'favoriteJourneys',
      ['userId', 'journeyId'],
      {
        type: 'unique',
        name: 'favoriteJourneys_unique_userId_journeyId',
      },
    );
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeConstraint(
      'favoriteJourneys',
      'favoriteJourneys_unique_userId_journeyId',
    );
  },
};
