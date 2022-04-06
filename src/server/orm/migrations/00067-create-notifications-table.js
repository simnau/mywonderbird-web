module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      relatedUserId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      entityType: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      entityId: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint(
      'notifications',
      ['userId', 'type', 'relatedUserId', 'entityType', 'entityId'],
      {
        type: 'unique',
        name: 'notifications_unique_notification',
      },
    );
    await queryInterface.addIndex('notifications', ['userId'], {
      name: 'notifications_userId_idx',
    });
    await queryInterface.addIndex('notifications', ['userId', 'read'], {
      name: 'notifications_userId_read_idx',
    });
    return queryInterface.addIndex('notifications', ['userId', 'type'], {
      name: 'notifications_userId_type_idx',
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('notifications');
  },
};
