module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('badgeConfigurations', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      achievedDescription: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    return await queryInterface.addConstraint(
      'badgeConfigurations',
      ['type', 'level'],
      {
        type: 'unique',
        name: 'badgeConfigurations_unique_type_level',
      },
    );
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('badgeConfigurations');
  },
};
