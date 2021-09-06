module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('gemCaptures', 'imagePath', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('gemCaptures', 'imagePath');
  },
};
