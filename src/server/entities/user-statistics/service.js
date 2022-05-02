const { UserStatistic } = require('../../orm/models/user-statistic');

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

  return userStatistic.update(
    {
      sharedPhotos: userStatistic.sharedPhotos + sharedPhotoIncrement,
    },
    options,
  );
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
