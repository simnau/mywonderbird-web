module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.addConstraint('terms', ['type', 'url'], {
      type: 'unique',
      name: 'terms_unique_type_url',
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.removeConstraint('terms', 'terms_unique_type_url');
  },
};
