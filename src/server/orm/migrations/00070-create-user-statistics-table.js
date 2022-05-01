module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('userStatistics', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sharedPhotos: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    return await queryInterface.addIndex('userStatistics', ['userId'], {
      type: 'unique',
      name: 'userStatistics_userId_idx',
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('userStatistics');
  },
};
