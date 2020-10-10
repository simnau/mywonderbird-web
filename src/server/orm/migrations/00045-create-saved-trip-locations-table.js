module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('savedTripLocations', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      skipped: {
        type: Sequelize.BOOLEAN,
      },
      sequenceNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      savedTripId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'savedTrips',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      placeId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'places',
          key: 'id',
        },
      },
      visitedAt: {
        type: Sequelize.DATE,
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
    return queryInterface.dropTable('savedTripLocations');
  },
};
