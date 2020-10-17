module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.changeColumn('placeImages', 'gemCaptureId', {
      type: Sequelize.UUID,
      allowNull: true,
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.changeColumn('placeImages', 'gemCaptureId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'gemCaptures',
        key: 'id',
      },
      onDelete: 'CASCADE',
    });
  },
};
