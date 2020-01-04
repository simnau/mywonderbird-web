module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('days', 'title', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('days', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
