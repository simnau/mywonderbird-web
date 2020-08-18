const { Op } = require('sequelize');

const { indexBy } = require('../../util/array');
const {
  Bookmark,
  BOOKMARK_TYPE_GEM_CAPTURE,
} = require('../../orm/models/bookmark');
const gemCaptureService = require('../gem-capture/service');
const gemService = require('../gem/service');

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
      const country = await gemService.getGemCountry(gemCapture.gem);

      return {
        id: bookmark.id,
        gemCaptureId: bookmark.entityId,
        title: gemCapture.title,
        country,
        imageUrl: gemCapture.url,
        location: {
          lat: gemCapture.gem.lat,
          lng: gemCapture.gem.lng,
        },
      };
    }),
  );
}

function createGemCaptureBookmark({
  userId,
  gemCaptureId: entityId,
  bookmarkGroupId,
}) {
  return Bookmark.create({
    userId,
    entityId,
    bookmarkGroupId,
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
