module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('places', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('places', 'description');
  },
};
