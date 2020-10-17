module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('placeImages', 'url', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('placeImages', 'url', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
