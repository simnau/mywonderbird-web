module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('journeyLikes', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      journeyId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'journeys',
          key: 'id',
        },
        onDelete: 'CASCADE',
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
    return queryInterface.dropTable('journeyLikes');
  },
};
