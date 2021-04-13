const sequelize = require('../../setup/sequelize');
const firebaseUtil = require('../../util/firebase');
const profileService = require('../profile/service');

const DEFAULT_GET_USERS_LIMIT = 20;

async function getUsers(
  limit = DEFAULT_GET_USERS_LIMIT,
  paginationToken,
  filter,
) {
  return firebaseUtil.listUsers({ limit, paginationToken });
}

async function createUser(email) {
  return firebaseUtil.createUser({ email });
}

async function updateUser(userId, updateData) {
  return profileService.createOrUpdateProfileByProviderId(userId, updateData);
}

async function deleteUser(userId) {
  const t = await sequelize.transaction();

  try {
    await profileService.deleteProfile({ id: userId }, { transaction: t });
    return firebaseUtil.deleteUser({ id: userId });
  } catch (e) {
    await t.rollback();
  }
}

async function getUser(userId) {
  return firebaseUtil.getUser({ id: userId });
}

async function updateUserRole(userId, role) {
  return profileService.updateRole({ id: userId, role });
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUser,
  updateUserRole,
};
