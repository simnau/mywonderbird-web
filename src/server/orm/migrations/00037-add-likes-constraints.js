module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addConstraint('likes', ['userId', 'type', 'entityId'], {
        type: 'unique',
        name: 'likes_unique_userId_type_entityId',
      }),
      queryInterface.addIndex('likes', ['userId', 'type', 'entityId'], {
        name: 'likes_userId_type_entityId_idx',
      }),
    ]);
  },
  down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeConstraint(
        'likes',
        'likes_unique_userId_type_entityId',
      ),
      queryInterface.removeIndex('likes', 'likes_userId_type_entityId_idx'),
    ]);
  },
};
