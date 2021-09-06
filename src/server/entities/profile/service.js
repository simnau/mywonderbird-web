const { Op } = require('sequelize');

const { AVATAR_FOLDER } = require('../../constants/s3');
const { userAvatarUrl, deleteFile } = require('../../util/s3');
const { uploadFile, imagePathToImageUrl } = require('../../util/file-upload');
const { Profile } = require('../../orm/models/profile');

async function findProfileById(id) {
  const profile = await Profile.findByPk(id);

  return toDTO(profile);
}

async function findProfileByProviderId(providerId) {
  const profile = await Profile.findOne({
    where: {
      providerId,
    },
  });

  return toDTO(profile);
}

async function createProfile(providerId, profileData = {}) {
  const createdProfile = await Profile.create({ ...profileData, providerId });

  return toDTO(createdProfile);
}

async function createOrUpdateProfileByProviderId(providerId, profileData) {
  const existingProfile = await findProfileByProviderId(providerId);

  if (existingProfile) {
    await Profile.update(profileData, {
      where: {
        id: existingProfile.id,
      },
    });
    return findProfileByProviderId(providerId);
  } else {
    return createProfile(providerId, profileData);
  }
}

async function deletePreviousAvatar(userId) {
  const userProfile = await findProfileByProviderId(userId);

  if (!userProfile.avatarUrl && !userProfile.avatarPath) {
    return;
  }

  const imageName = userProfile.avatarPath
    ? userProfile.avatarPath
    : userProfile.avatarUrl.substring(
        userProfile.avatarUrl.lastIndexOf('/') + 1,
      );
  const avatarFile = userAvatarUrl(AVATAR_FOLDER, userId, imageName);

  await deleteFile(avatarFile);
}

async function uploadAvatar(files, folder) {
  return uploadFile(files, folder);
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
  const profiles = await Profile.findAll({
    where: {
      providerId: {
        [Op.in]: providerIds,
      },
    },
  });

  return profiles.map(toDTO);
}

async function updateRole({ id, role }) {
  const existingProfile = await findProfileByProviderId(id);

  await Profile.update(
    {
      role,
    },
    {
      where: {
        id: existingProfile.id,
      },
    },
  );
  return findProfileByProviderId(id);
}

async function deleteProfile({ id }, { transaction } = {}) {
  return Profile.destroy(
    {
      where: {
        providerId: id,
      },
    },
    { transaction },
  );
}

function toDTO(profile) {
  if (!profile) {
    return profile;
  }

  return {
    ...(profile.toJSON ? profile.toJSON() : profile),
    avatarUrl: profile.avatarPath
      ? imagePathToImageUrl(profile.avatarPath)
      : profile.avatarUrl,
  };
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
  toDTO,
};
