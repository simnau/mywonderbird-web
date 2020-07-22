module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('gems', 'journeyId', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'journeys',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('gems', 'journeyId');
  },
};
