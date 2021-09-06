module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('placeImages', 'imagePath', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('placeImage', 'imagePath');
  },
};
