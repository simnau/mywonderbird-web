module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('gems', 'type', {
      type: Sequelize.STRING,
      defaultValue: 'any',
      allowNull: false,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('gems', 'type');
  },
};
