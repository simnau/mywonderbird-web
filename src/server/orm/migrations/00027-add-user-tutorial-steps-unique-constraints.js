module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addConstraint(
      'userTutorialSteps',
      ['stepName', 'userId'],
      {
        type: 'unique',
        name: 'userTutorialSteps_unique_stepName_userId',
      },
    );
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeConstraint(
      'userTutorialSteps',
      'userTutorialSteps_unique_stepName_userId',
    );
  },
};
