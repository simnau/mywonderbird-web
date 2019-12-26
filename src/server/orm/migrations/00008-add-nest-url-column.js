module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addColumn('nests', 'url', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('nests', 'url');
  },
};
