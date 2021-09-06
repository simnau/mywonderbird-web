module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('tags', 'imageUrl', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('tags', 'imageUrl', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },
};
