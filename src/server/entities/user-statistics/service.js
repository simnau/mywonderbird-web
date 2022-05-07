const {
  CONTENT_CREATOR_TYPE,
} = require('../../orm/models/badge-configuration');
const { UserStatistic } = require('../../orm/models/user-statistic');
const badgeService = require('../badges/service');

async function findByUserId({ userId }, options) {
  return UserStatistic.findOne({
    ...options,
    where: {
      userId,
    },
  });
}

async function incrementSharedPhotos(
  { userId, sharedPhotoIncrement },
  options,
) {
  const userStatistic = await findByUserId({ userId });

  if (!userStatistic) {
    return userStatistic;
  }

  const oldPhotoCount = userStatistic.sharedPhotos;
  const newSharedPhotoCount = userStatistic.sharedPhotos + sharedPhotoIncrement;
  const userStatisticUpdate = await userStatistic.update(
    {
      sharedPhotos: newSharedPhotoCount,
    },
    options,
  );

  await badgeService.handleBadgeChanges({
    userId,
    type: CONTENT_CREATOR_TYPE,
    newCount: newSharedPhotoCount,
    startingCount: oldPhotoCount,
  });

  return userStatisticUpdate;
}

async function decrementSharedPhotos(
  { userId, sharedPhotoDecrement },
  options,
) {
  const userStatistic = await findByUserId({ userId });

  if (!userStatistic) {
    return userStatistic;
  }

  return userStatistic.update(
    {
      sharedPhotos: Math.max(
        userStatistic.sharedPhotos - sharedPhotoDecrement,
        0,
      ),
    },
    options,
  );
}

module.exports = {
  findByUserId,
  incrementSharedPhotos,
  decrementSharedPhotos,
};
