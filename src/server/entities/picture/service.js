const { getGeohash } = require('../../util/geo');
const fileUploader = require('../../util/file-upload');
const gemService = require('../gem/service');
const gemCaptureService = require('../gem-capture/service');
const placeService = require('../place/service');
const geoService = require('../geo/service');
const sequelize = require('../../setup/sequelize');

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

  return Promise.all(gemCaptures.map(toFeedDto));
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
    likeCount: 0, //TODO
    isLiked: false, // TODO
    isBookmarked: false, // TODO
  };
}

module.exports = {
  sharePicture,
  uploadFiles,
  findFeedItems,
};
