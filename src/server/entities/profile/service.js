const { Op } = require('sequelize');

const fileUploader = require('../../util/file-upload');
const { Profile } = require('../../orm/models/profile');

async function findProfileById(id) {
  return Profile.findByPk(id);
}

async function findProfileByProviderId(providerId) {
  return Profile.findOne({
    where: {
      providerId,
    },
  });
}

async function createOrUpdateProfileByProviderId(providerId, profileData) {
  const existingProfile = await findProfileByProviderId(providerId);

  if (existingProfile) {
    return existingProfile.update(profileData);
  } else {
    return Profile.create({ ...profileData, providerId });
  }
}

async function uploadAvatar(files, folder) {
  const { images } = await fileUploader(files, folder, true);

  return {
    images,
  };
}

async function findProfilesByProviderIds(providerIds) {
  return Profile.findAll({
    where: {
      providerId: {
        [Op.in]: providerIds,
      },
    },
  });
}

module.exports = {
  findProfileById,
  findProfileByProviderId,
  findProfilesByProviderIds,
  createOrUpdateProfileByProviderId,
  uploadAvatar,
};
