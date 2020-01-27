const { UserTutorialSteps } = require('../../orm/models/user-tutorial-steps');

function markPassedForUser(userId, steps) {
  return Promise.all(
    steps.map(stepName =>
      UserTutorialSteps.upsert({
        userId,
        stepName,
        passed: true,
      }),
    ),
  );
}

function findByUserId(userId) {
  return UserTutorialSteps.findAll({
    where: {
      userId,
    },
  });
}

module.exports = {
  markPassedForUser,
  findByUserId,
};
