module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addIndex('places', {
      fields: ['lat', 'lng'],
      name: 'idx_places_lat_lng',
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeIndex('places', 'idx_places_lat_lng');
  },
};
