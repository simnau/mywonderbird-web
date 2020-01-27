module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('userTutorialSteps', {
      id: {
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4,
      },
      stepName: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'tutorialSteps',
          key: 'stepName',
        },
        onDelete: 'CASCADE',
      },
      passed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      userId: {
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
    return queryInterface.dropTable('userTutorialSteps');
  },
};
