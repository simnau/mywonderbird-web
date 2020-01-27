const { TutorialSteps } = require('../../orm/models/tutorial-steps');

function findById(id) {
  return TutorialSteps.findByPk(id);
}

function findAll() {
  return TutorialSteps.findAll();
}

function create(tutorialStep) {
  return TutorialSteps.create(tutorialStep);
}

async function update(id, tutorialStep) {
  const existingTutorialStep = await findById(id);

  if (!existingTutorialStep) {
    const error = new Error('Tutorial step does not exist');
    error.status = 404;
    throw error;
  }

  return existingTutorialStep.update(tutorialStep);
}

function deleteById(id) {
  return TutorialSteps.destroy({
    where: {
      id,
    },
    limit: 1,
  });
}

module.exports = {
  findById,
  findAll,
  update,
  create,
  deleteById,
};
