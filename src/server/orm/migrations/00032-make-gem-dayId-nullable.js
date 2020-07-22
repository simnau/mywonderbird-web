module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('gems', 'gems_dayId_fkey');

    return queryInterface.changeColumn('gems', 'dayId', {
      type: Sequelize.UUID,
      allowNull: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('gems', 'gems_dayId_fkey');

    return queryInterface.changeColumn('gems', 'dayId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'days',
        key: 'id',
      },
    });
  },
};
