module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('placeTags', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      placeId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'places',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      tagId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tags',
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
    return queryInterface.dropTable('placeTags');
  },
};
