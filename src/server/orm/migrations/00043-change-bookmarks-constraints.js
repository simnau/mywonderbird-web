module.exports = {
  up(queryInterface, Sequelize) {

    return Promise.all([
      queryInterface.removeConstraint(
        'bookmarks',
        'bookmarks_unique_userId_type_entityId',
      ),
      queryInterface.removeIndex('bookmarks', 'bookmarks_userId_type_entityId_idx'),
      queryInterface.addConstraint('bookmarks', ['userId', 'type', 'entityId', 'bookmarkGroupId'], {
        type: 'unique',
        name: 'bookmarks_unique_userId_type_entityId_bookmarkGroupId',
      }),
      queryInterface.addIndex('bookmarks', ['userId', 'type', 'entityId', 'bookmarkGroupId'], {
        name: 'bookmarks_userId_type_entityId_bookmarkGroupId_idx',
      }),
    ]);
  },
  down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeConstraint(
        'bookmarks',
        'bookmarks_unique_userId_type_entityId_bookmarkGroupId',
      ),
      queryInterface.removeIndex('bookmarks', 'bookmarks_userId_type_entityId_bookmarkGroupId_idx'),
      queryInterface.addConstraint('bookmarks', ['userId', 'type', 'entityId'], {
        type: 'unique',
        name: 'bookmarks_unique_userId_type_entityId',
      }),
      queryInterface.addIndex('bookmarks', ['userId', 'type', 'entityId'], {
        name: 'bookmarks_userId_type_entityId_idx',
      }),
    ]);
  },
};
