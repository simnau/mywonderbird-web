module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('nests', 'platform', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('nests', 'idOnPlatform', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },
  down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('nests', 'platform', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('nests', 'idOnPlatform', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
    ]);
  },
};
