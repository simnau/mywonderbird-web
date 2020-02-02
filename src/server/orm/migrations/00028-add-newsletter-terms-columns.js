module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('profiles', 'acceptedNewsletter', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
      queryInterface.addColumn('profiles', 'acceptedTermsAt', {
        type: Sequelize.DATE,
        defaultValue: null,
      }),
    ]);
  },
  down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('profiles', 'acceptedNewsletter'),
      queryInterface.removeColumn('profiles', 'acceptedTermsAt'),
    ]);
  },
};
