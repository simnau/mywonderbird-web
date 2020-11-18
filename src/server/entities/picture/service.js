const sequelize = require('../../setup/sequelize');
const { unique } = require('../../util/array');
const { getGeohash } = require('../../util/geo');
const {
  uploadFile,
} = require('../../util/file-upload');
const gemService = require('../gem/service');
const gemCaptureService = require('../gem-capture/service');
const placeService = require('../place/service');
const geoService = require('../geo/service');
const likeService = require('../like/service');
const bookmarkService = require('../bookmark/service');

async function sharePicture(
  { title, imageUrl, location, creationDate },
  journeyId,
  userId,
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

  const transaction = await sequelize.transaction();

  try {
    const createdGem = await gemService.create(gem, transaction);
    await placeService.createFromGem(
      createdGem.toJSON(),
      location,
      userId,
      transaction,
    );

    await transaction.commit();
    return createdGem;
  } catch (e) {
    await transaction.rollback();
    throw e;
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

  const withCounts = gemCaptures.map(gemCapture => {
    const rawGemCapture = gemCapture.toJSON();

    return {
      ...rawGemCapture,
      likeCount: likeCounts[gemCapture.id],
      isLiked: groupedUserLikes[gemCapture.id] || false,
      isBookmarked: groupedUserBookmarks[gemCapture.id] || false,
    };
  });

  return Promise.all(withCounts.map(toFeedDto));
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
  };
}

module.exports = {
  sharePicture,
  uploadFiles,
  findFeedItems,
  augmentFeed,
};
