module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addColumn('savedTripLocations', 'dayIndex', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    })
  },
  down() {}
}
