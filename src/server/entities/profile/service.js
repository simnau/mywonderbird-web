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

async function createProfile(providerId, profileData = {}) {
  return Profile.create({ ...profileData, providerId });
}

async function createOrUpdateProfileByProviderId(providerId, profileData) {
  const existingProfile = await findProfileByProviderId(providerId);

  if (existingProfile) {
    await existingProfile.update(profileData);
    return findProfileByProviderId(providerId);
  } else {
    return createProfile(providerId, profileData);
  }
}

async function uploadAvatar(files, folder) {
  const { images } = await fileUploader(files, folder, true);

  return {
    images,
  };
}

async function findOrCreateProfileByProviderId(providerId) {
  let profile = await findProfileByProviderId(providerId);

  if (!profile) {
    profile = await createProfile(providerId);
  }

  return profile;
}

async function findOrCreateProfilesByProviderIds(providerIds) {
  return Promise.all(
    providerIds.map(async providerId =>
      findOrCreateProfileByProviderId(providerId),
    ),
  );
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
  findOrCreateProfileByProviderId,
  findOrCreateProfilesByProviderIds,
  createProfile,
  createOrUpdateProfileByProviderId,
  uploadAvatar,
};
