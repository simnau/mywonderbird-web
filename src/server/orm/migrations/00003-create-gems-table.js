module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('gems', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      lat: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      lng: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      sequenceNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      dayId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'days',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('gems');
  },
};
