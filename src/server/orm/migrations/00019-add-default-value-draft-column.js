module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('journeys', 'draft', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      nullable: false,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('journeys', 'draft', {
      type: Sequelize.BOOLEAN,
    });
  },
};
