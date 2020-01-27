module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addConstraint('tutorialSteps', ['stepName'], {
      type: 'unique',
      name: 'tutorialSteps_unique_stepName',
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeConstraint(
      'tutorialSteps',
      'tutorialSteps_unique_stepName',
    );
  },
};
