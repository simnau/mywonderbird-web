module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('profiles', 'avatarUrl', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('profiles', 'avatarUrl', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },
};
