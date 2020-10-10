module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('savedTrips', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      countryCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startedAt: {
        type: Sequelize.DATE,
      },
      finishedAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
    return queryInterface.addIndex('savedTrips', ['userId'], {
      name: 'savedTrips_userId_idx',
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('savedTrips');
  },
};
