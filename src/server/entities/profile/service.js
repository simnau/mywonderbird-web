const { Profile } = require('../../orm/models/profile');

async function findProfileById(id) {
  return Profile.findByPk(id);
}

async function createOrUpdateProfile(id, profileData) {
  const existingProfile = await findProfileById(id);

  if (existingProfile) {
    return existingProfile.update(profileData);
  } else {
    return Profile.create({ ...profileData, id });
  }
}

module.exports = {
  findProfileById,
  createOrUpdateProfile,
};
