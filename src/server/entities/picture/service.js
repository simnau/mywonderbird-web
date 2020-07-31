const sequelize = require('../../setup/sequelize');
const { unique } = require('../../util/array');
const { getGeohash } = require('../../util/geo');
const fileUploader = require('../../util/file-upload');
const gemService = require('../gem/service');
const gemCaptureService = require('../gem-capture/service');
const placeService = require('../place/service');
const geoService = require('../geo/service');
const likeService = require('../like/service');

async function sharePicture(
  { title, imageUrl, location, creationDate },
  journeyId,
  userId,
) {
  const lastGem = await gemService.findLastForJourney(journeyId);

  const sequenceNumber = lastGem ? lastGem.sequenceNumber + 1 : 0;

  const gem = {
    title,
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
  const { images } = await fileUploader(files, folder);

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
  const likeCounts = await likeService.countByGemCaptureIds(gemCaptureIds);
  const likesByUser = await likeService.findByGemCaptureIdsAndUserId(
    gemCaptureIds,
    userId,
    { attributes: ['entityId'] },
  );
  const groupedUserLikes = likesByUser.reduce((result, item) => {
    return {
      ...result,
      [item.entityId]: true,
    };
  }, {});

  const withCounts = gemCaptures.map(gemCapture => {
    const rawGemCapture = gemCapture.toJSON();

    return {
      ...rawGemCapture,
      likeCount: likeCounts[gemCapture.id],
      isLiked: groupedUserLikes[gemCapture.id] || false,
    };
  });

  return Promise.all(withCounts.map(toFeedDto));
}

async function toFeedDto(feedItem) {
  let place;

  // TODO Optimize this so it's done with one database request
  if (feedItem.gem) {
    const geohash = getGeohash(feedItem.gem.lat, feedItem.gem.lng);
    place = await placeService.findByGeohash(geohash);
  }

  return {
    id: feedItem.id,
    imageUrl: feedItem.url,
    title: feedItem.gem ? feedItem.gem.title : feedItem.title,
    country: place
      ? geoService.getLabelBy3LetterCountryCode(place.countryCode)
      : null,
    updatedAt: feedItem.updatedAt,
    likeCount: feedItem.likeCount || 0,
    isLiked: feedItem.isLiked,
    isBookmarked: false, // TODO
  };
}

module.exports = {
  sharePicture,
  uploadFiles,
  findFeedItems,
  augmentFeed,
};
