module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addConstraint(
      'journeyLikes',
      ['userId', 'journeyId'],
      {
        type: 'unique',
        name: 'journeyLikes_unique_userId_journeyId',
      },
    );
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeConstraint(
      'journeyLikes',
      'journeyLikes_unique_userId_journeyId',
    );
  },
};
