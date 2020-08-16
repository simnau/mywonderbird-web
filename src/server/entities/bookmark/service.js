const { Op } = require('sequelize');

const { indexBy } = require('../../util/array');
const { getGeohash } = require('../../util/geo');
const {
  Bookmark,
  BOOKMARK_TYPE_GEM_CAPTURE,
} = require('../../orm/models/bookmark');
const gemCaptureService = require('../gem-capture/service');
const placeService = require('../place/service');
const geoService = require('../geo/service');

const DEFAULT_PAGE_SIZE = 20;

async function findGemCaptureBookmarks(
  userId,
  page = 0,
  pageSize = DEFAULT_PAGE_SIZE,
) {
  const userBookmarks = await Bookmark.scope('gemCapture').findAll({
    where: {
      userId,
    },
    offset: page * pageSize,
    limit: pageSize,
    order: [['createdAt', 'DESC']],
  });

  const gemCaptureIds = userBookmarks.map(bookmark => bookmark.entityId);
  const gemCaptures = await gemCaptureService.findByIds(gemCaptureIds);
  const gemCapturesById = indexBy(gemCaptures, 'id');

  return Promise.all(
    userBookmarks.map(async bookmark => {
      const gemCapture = gemCapturesById[bookmark.entityId];
      let place;

      // TODO Optimize this so it's done with one database request
      if (gemCapture.gem) {
        const geohash = getGeohash(gemCapture.gem.lat, gemCapture.gem.lng);
        place = await placeService.findByGeohash(geohash);
      }

      return {
        id: bookmark.id,
        gemCaptureId: bookmark.entityId,
        title: gemCapture.title,
        country: place
          ? geoService.getLabelBy3LetterCountryCode(place.countryCode)
          : null,
        imageUrl: gemCapture.url,
        location: {
          lat: gemCapture.gem.lat,
          lng: gemCapture.gem.lng,
        },
      };
    }),
  );
}

function createGemCaptureBookmark({ userId, gemCaptureId: entityId }) {
  return Bookmark.create({
    userId,
    entityId,
    type: BOOKMARK_TYPE_GEM_CAPTURE,
  });
}

function findyByUserIdAndGemCaptureId(userId, gemCaptureId) {
  return Bookmark.scope('gemCapture').findOne({
    where: {
      userId,
      entityId: gemCaptureId,
    },
  });
}

function deleteByUserIdAndGemCaptureId(userId, gemCaptureId) {
  return Bookmark.scope('gemCapture').destroy({
    where: {
      userId,
      entityId: gemCaptureId,
    },
    limit: 1,
  });
}

function findByGemCaptureIdsAndUserId(
  gemCaptureIds,
  userId,
  { attributes = null },
) {
  return Bookmark.scope('gemCapture').findAll({
    where: {
      entityId: {
        [Op.in]: gemCaptureIds,
      },
      userId,
    },
    attributes,
  });
}

module.exports = {
  findGemCaptureBookmarks,
  createGemCaptureBookmark,
  findyByUserIdAndGemCaptureId,
  findByGemCaptureIdsAndUserId,
  deleteByUserIdAndGemCaptureId,
};
