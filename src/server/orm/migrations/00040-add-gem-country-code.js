module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('gems', 'countryCode', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('gems', 'countryCode');
  },
};
