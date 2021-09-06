module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('profiles', 'avatarPath', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('profiles', 'avatarPath');
  },
};
