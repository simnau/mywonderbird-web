const { Op } = require('sequelize');

const { AVATAR_FOLDER } = require('../../constants/s3');
const { userAvatarUrl, deleteFile } = require('../../util/s3');
const { uploadFile } = require('../../util/file-upload');
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

async function deletePreviousAvatar(userId) {
  const userProfile = await findProfileByProviderId(userId);

  if (!userProfile.avatarUrl) {
    return;
  }

  const imageName = userProfile.avatarUrl.substring(
    userProfile.avatarUrl.lastIndexOf('/') + 1,
  );
  const avatarFile = userAvatarUrl(AVATAR_FOLDER, userId, imageName);

  await deleteFile(avatarFile);
}

async function uploadAvatar(files, folder) {
  const { images } = await uploadFile(files, folder);

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

async function updateRole({ id, role }) {
  const existingProfile = await findProfileByProviderId(id);

  await existingProfile.update({
    role,
  });
  return findProfileByProviderId(id);
}

async function deleteProfile({ id }, { transaction } = {}) {
  return Profile.destroy({
    where: {
      providerId: id,
    },
  }, { transaction });
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
  deletePreviousAvatar,
  updateRole,
  deleteProfile,
};
