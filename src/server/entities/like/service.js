const { Op, fn } = require('sequelize');

const { Like, LIKE_TYPE_GEM_CAPTURE } = require('../../orm/models/like');

function createGemCaptureLike({ userId, gemCaptureId: entityId }) {
  return Like.create({
    userId,
    entityId,
    type: LIKE_TYPE_GEM_CAPTURE,
  });
}

function findyByUserIdAndGemCaptureId(userId, gemCaptureId) {
  return Like.findOne({
    where: {
      userId,
      entityId: gemCaptureId,
      type: LIKE_TYPE_GEM_CAPTURE,
    },
  });
}

function findByGemCaptureId(gemCaptureId) {
  return Like.findAll({
    where: {
      entityId: gemCaptureId,
      type: LIKE_TYPE_GEM_CAPTURE,
    },
    order: [['updatedAt', 'DESC']],
  });
}

function deleteByUserIdAndGemCaptureId(userId, gemCaptureId) {
  return Like.destroy({
    where: {
      userId,
      entityId: gemCaptureId,
      type: LIKE_TYPE_GEM_CAPTURE,
    },
    limit: 1,
  });
}

function countByGemCaptureId(gemCaptureId) {
  return Like.count({
    where: {
      entityId: gemCaptureId,
      type: LIKE_TYPE_GEM_CAPTURE,
    },
  });
}

async function countByGemCaptureIds(gemCaptureIds) {
  const results = await Like.findAll({
    where: {
      entityId: {
        [Op.in]: gemCaptureIds,
      },
      type: LIKE_TYPE_GEM_CAPTURE,
    },
    group: ['entityId'],
    attributes: ['entityId', [fn('COUNT', 'entityId'), 'count']],
    raw: true,
  });

  const countsByGemCaptureId = results.reduce((result, item) => {
    return {
      ...result,
      [item.entityId]: parseInt(item.count, 10),
    };
  }, {});

  return countsByGemCaptureId;
}

function findByGemCaptureIdsAndUserId(
  gemCaptureIds,
  userId,
  { attributes = null },
) {
  return Like.findAll({
    where: {
      entityId: {
        [Op.in]: gemCaptureIds,
      },
      type: LIKE_TYPE_GEM_CAPTURE,
      userId,
    },
    attributes,
  });
}

module.exports = {
  createGemCaptureLike,
  findyByUserIdAndGemCaptureId,
  findByGemCaptureId,
  findByGemCaptureIdsAndUserId,
  deleteByUserIdAndGemCaptureId,
  countByGemCaptureId,
  countByGemCaptureIds,
};
