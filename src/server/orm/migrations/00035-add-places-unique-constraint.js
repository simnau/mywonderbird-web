module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addConstraint('places', ['geohash'], {
      type: 'unique',
      name: 'places_unique_geohash',
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeConstraint('places', 'places_unique_geohash');
  },
};
