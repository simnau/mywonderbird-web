module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('gems', 'title', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('gems', 'title', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
