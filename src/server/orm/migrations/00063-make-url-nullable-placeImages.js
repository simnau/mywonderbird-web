module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('placeImages', 'url', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('placeImages', 'url', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },
};
