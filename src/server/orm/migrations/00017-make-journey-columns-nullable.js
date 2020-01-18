module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('journeys', 'title', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('journeys', 'startDate', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },
  down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('journeys', 'title', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('journeys', 'startDate', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
    ]);
  },
};
