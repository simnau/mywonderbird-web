module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('bookmarks', 'bookmarkGroupId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'bookmarkGroups',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('bookmarks', 'bookmarkGroupId');
  },
};
