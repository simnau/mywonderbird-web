const sequelize = require('../../setup/sequelize');
const { unique, indexBy } = require('../../util/array');
const { uploadFile } = require('../../util/file-upload');
const gemService = require('../gem/service');
const gemCaptureService = require('../gem-capture/service');
const placeService = require('../place/service');
const likeService = require('../like/service');
const bookmarkService = require('../bookmark/service');
const profileService = require('../profile/service');
const journeyService = require('../journey/service');

async function sharePicture(
  { title, imageUrl, location, creationDate },
  journeyId,
  userId,
  { transaction } = {},
) {
  const lastGem = await gemService.findLastForJourney(journeyId);

  const sequenceNumber = lastGem ? lastGem.sequenceNumber + 1 : 0;

  const gem = {
    title,
    countryCode: location.countryCode,
    lat: location.lat,
    lng: location.lng,
    sequenceNumber,
    journeyId,
    createdAt: creationDate,
    updatedAt: creationDate,
    gemCaptures: [
      {
        title,
        url: imageUrl,
        sequenceNumber: 0,
      },
    ],
  };

  const tx = transaction || (await sequelize.transaction());

  try {
    const createdGem = await gemService.create(gem, tx);
    await placeService.createFromGem(createdGem.toJSON(), location, userId, tx);

    await tx.commit();
    return createdGem;
  } catch (e) {
    if (!transaction) {
      await tx.rollback();
    }
    throw e;
  }
}

async function sharePictureWithJourney({
  picture,
  journeyId,
  journeyTitle,
  userId,
  files,
}) {
  if (!files) {
    throw new Error('No images provided when sharing');
  }

  if (journeyId) {
    const { images } = await uploadFiles(files, journeyId);

    return sharePicture(
      {
        ...picture,
        imageUrl: images[0],
      },
      journeyId,
      userId,
    );
  } else {
    const transaction = await sequelize.transaction();

    try {
      const savedJourney = await journeyService.create(
        {
          title: journeyTitle,
          startDate: new Date(),
          userId,
          creatorId: userId,
          draft: false,
        },
        {
          transaction,
        },
      );

      const { images } = await uploadFiles(files, savedJourney.id);
      await sharePicture(
        {
          ...picture,
          imageUrl: images[0],
        },
        savedJourney.id,
        userId,
        { transaction },
      );

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }
}

async function uploadFiles(files, folder) {
  const { images } = await uploadFile(files, folder);

  return {
    images,
  };
}

async function findFeedItems(lastDatetime, limit, direction) {
  const gemCaptures = await gemCaptureService.findFeedItems(
    lastDatetime,
    limit,
    direction,
  );

  return gemCaptures;
}

async function augmentFeed(gemCaptures, userId) {
  const gemCaptureIds = unique(gemCaptures.map(gemCapture => gemCapture.id));
  const { likeCounts, groupedUserLikes } = await getLikeStats(
    gemCaptureIds,
    userId,
  );
  const groupedUserBookmarks = await getBookmarkStats(gemCaptureIds, userId);
  const groupedProfiles = await getUserProfiles(gemCaptures);

  const augmented = gemCaptures.map(gemCapture => {
    const rawGemCapture = gemCapture.toJSON();
    const rawUser = groupedProfiles[gemCapture.gem.journey.userId]
      ? groupedProfiles[gemCapture.gem.journey.userId].toJSON()
      : null;

    return {
      ...rawGemCapture,
      likeCount: likeCounts[gemCapture.id],
      isLiked: groupedUserLikes[gemCapture.id] || false,
      isBookmarked: groupedUserBookmarks[gemCapture.id] || false,
      userId: gemCapture.gem.journey.userId,
      userAvatarUrl: rawUser && rawUser.avatarUrl,
    };
  });

  return Promise.all(augmented.map(toFeedDto));
}

async function getLikeStats(gemCaptureIds, userId) {
  const [likeCounts, likesByUser] = await Promise.all([
    likeService.countByGemCaptureIds(gemCaptureIds),
    likeService.findByGemCaptureIdsAndUserId(gemCaptureIds, userId, {
      attributes: ['entityId'],
    }),
  ]);
  const groupedUserLikes = likesByUser.reduce((result, item) => {
    return {
      ...result,
      [item.entityId]: true,
    };
  }, {});

  return {
    likeCounts,
    groupedUserLikes,
  };
}

async function getBookmarkStats(gemCaptureIds, userId) {
  const bookmarksByUser = await bookmarkService.findByGemCaptureIdsAndUserId(
    gemCaptureIds,
    userId,
    {
      attributes: ['entityId'],
    },
  );

  return bookmarksByUser.reduce((result, item) => {
    return {
      ...result,
      [item.entityId]: true,
    };
  }, {});
}

async function getUserProfiles(gemCaptures) {
  const userIds = unique(
    gemCaptures.map(gemCapture => {
      return gemCapture.gem.journey.userId;
    }),
  );

  const profiles = await profileService.findProfilesByProviderIds(userIds);

  return indexBy(profiles, 'providerId');
}

async function toFeedDto(feedItem) {
  const country = await gemService.getGemCountry(feedItem.gem);

  return {
    id: feedItem.id,
    journeyId: feedItem.gem ? feedItem.gem.journeyId : null,
    imageUrl: feedItem.url,
    title: feedItem.gem ? feedItem.gem.title : feedItem.title,
    country,
    updatedAt: feedItem.updatedAt,
    likeCount: feedItem.likeCount || 0,
    isLiked: feedItem.isLiked,
    isBookmarked: feedItem.isBookmarked,
    userId: feedItem.userId,
    userAvatarUrl: feedItem.userAvatarUrl,
  };
}

module.exports = {
  sharePicture,
  sharePictureWithJourney,
  uploadFiles,
  findFeedItems,
  augmentFeed,
};
