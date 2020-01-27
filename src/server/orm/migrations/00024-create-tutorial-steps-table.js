module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('tutorialSteps', {
      id: {
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
      },
      stepName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      stepText: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('tutorialSteps');
  },
};
