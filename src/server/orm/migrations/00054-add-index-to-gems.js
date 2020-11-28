module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addIndex('gems', {
      fields: ['lat', 'lng'],
      name: 'idx_gems_lat_lng',
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeIndex('gems', 'idx_gems_lat_lng');
  },
};
