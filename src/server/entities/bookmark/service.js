const { Op, fn } = require('sequelize');

const { Bookmark, BOOKMARK_TYPE_GEM_CAPTURE } = require('../../orm/models/bookmark');

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
  createGemCaptureBookmark,
  findyByUserIdAndGemCaptureId,
  findByGemCaptureIdsAndUserId,
  deleteByUserIdAndGemCaptureId,
};
