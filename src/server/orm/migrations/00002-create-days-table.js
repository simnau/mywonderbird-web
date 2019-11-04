module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('days', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      dayNumber: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('days');
  },
};
