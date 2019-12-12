const fileUploader = require('../../util/file-upload');
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

async function uploadAvatar(files, folder) {
  const { images } = await fileUploader(files, folder, true);

  return {
    images,
  };
}

module.exports = {
  findProfileById,
  createOrUpdateProfile,
  uploadAvatar,
};
