module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable(
      'journeyComments',
      {
        id: {
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        comment: {
          type: Sequelize.TEXT,
          allowNull: false,
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
      },
      {
        charset: 'utf8mb4',
      },
    );
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('journeyComments');
  },
};
