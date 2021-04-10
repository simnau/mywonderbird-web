module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('profiles', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'USER',
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('profiles', 'role');
  },
};
