const admin = require('firebase-admin');

const { indexBy } = require('./array');
const profileService = require('../entities/profile/service');
const { ADMIN_ROLE } = require('../constants/roles');

async function listUsers({ limit, paginationToken }) {
  const { users, pageToken } = await admin
    .auth()
    .listUsers(limit, paginationToken);

  const userIds = users.map(user => user.uid);

  const userProfiles = await profileService.findProfilesByProviderIds(userIds);
  const userProfilesById = indexBy(userProfiles, 'providerId');
  const resultUsers = users.map(user => {
    const profile = userProfilesById[user.uid];

    return {
      id: user.uid,
      email: user.email,
      role: profile ? profile.role : 'GUEST',
    };
  });

  return {
    users: resultUsers,
    paginationToken: pageToken,
  };
}

async function getUser({ id }) {
  const user = await admin.auth().getUser(id);
  const profile = await profileService.findOrCreateProfileByProviderId(id);

  return {
    id: user.uid,
    email: user.email,
    role: profile ? profile.role : 'GUEST',
  };
}

async function createUser({ email }) {
  const createdUser = await admin.auth().createUser({
    email,
    disabled: false,
  });
  const profile = await profileService.findOrCreateProfileByProviderId(createdUser.uid);

  return {
    id: createdUser.uid,
    email: createdUser.email,
    role: profile ? profile.role : 'GUEST',
  };
}

async function deleteUser({ id }) {
  const user = await getUser({ id });

  if (!user) {
    throw new Error(`User with userId ${id} not found`);
  }

  if (user.role === ADMIN_ROLE) {
    throw new Error('Cannot delete an admin user');
  }

  await admin.auth().deleteUser(id);
}

module.exports = {
  listUsers,
  getUser,
  createUser,
  deleteUser,
};
