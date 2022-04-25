module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notificationTokens', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      deviceToken: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addIndex(
      'notificationTokens',
      ['userId', 'deviceToken'],
      {
        name: 'notificationTokens_userId_deviceToken_idx',
      },
    );
    await queryInterface.addIndex('notificationTokens', ['deviceToken'], {
      name: 'notificationTokens_deviceToken_idx',
    });
    return await queryInterface.addIndex('notificationTokens', ['userId'], {
      name: 'notificationTokens_userId_idx',
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('notificationTokens');
  },
};
