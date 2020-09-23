const { Profile } = require('../models/profile');

// This probably should've been a one-of task
module.exports = {
  async up(queryInterface, Sequelize) {
    // await queryInterface.addColumn('profiles', 'providerId', {
    //   type: Sequelize.STRING,
    //   defaultValue: Sequelize.UUIDV4,
    //   unique: true,
    // });

    // const profiles = await Profile.findAll();

    // return Promise.all(
    //   profiles.map(profile => {
    //     return profile.update({
    //       providerId: profile.id,
    //     });
    //   }),
    // );
  },
  down(queryInterface, Sequelize) {
    // return queryInterface.removeColumn('profiles', 'providerId');
  },
};
