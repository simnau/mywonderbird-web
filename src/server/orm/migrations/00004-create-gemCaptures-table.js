module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('gemCaptures', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      sequenceNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      gemId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'gems',
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
    return queryInterface.dropTable('gemCaptures');
  },
};
