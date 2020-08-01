const cognitoUtil = require('../../util/cognito');

const DEFAULT_GET_USERS_LIMIT = 20;

async function getUsers(
  limit = DEFAULT_GET_USERS_LIMIT,
  paginationToken,
  filter,
) {
  return cognitoUtil.listUsers(limit, paginationToken, filter);
}

async function createUser(email) {
  return cognitoUtil.createUser(email);
}

async function deleteUser(userId) {
  return cognitoUtil.deleteUser(userId);
}

async function getUser(userId) {
  return cognitoUtil.getUser(userId);
}

async function updateUserRole(userId, role) {
  return cognitoUtil.updateUserRole(userId, role);
}

module.exports = {
  getUsers,
  createUser,
  deleteUser,
  getUser,
  updateUserRole,
};
