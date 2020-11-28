module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addIndex('places', {
      fields: ['deletedAt'],
      name: 'idx_places_deletedAt',
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeIndex('places', 'idx_places_deletedAt');
  },
};
