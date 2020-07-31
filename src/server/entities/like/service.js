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
  return Like.scope('gemCapture').findOne({
    where: {
      userId,
      entityId: gemCaptureId,
    },
  });
}

function findByGemCaptureId(gemCaptureId) {
  return Like.scope('gemCapture').findAll({
    where: {
      entityId: gemCaptureId,
    },
    order: [['updatedAt', 'DESC']],
  });
}

function deleteByUserIdAndGemCaptureId(userId, gemCaptureId) {
  return Like.scope('gemCapture').destroy({
    where: {
      userId,
      entityId: gemCaptureId,
    },
    limit: 1,
  });
}

function deleteByGemCaptureId(gemCaptureId) {
  return Like.scope('gemCapture').destroy({
    where: {
      entityId: gemCaptureId,
    },
    limit: 1,
  });
}

function deleteByGemCaptureIds(gemCaptureIds, { transaction = null }) {
  return Like.destroy(
    {
      where: {
        entityId: {
          [Op.in]: gemCaptureIds,
        },
      },
    },
    { transaction },
  );
}

function countByGemCaptureId(gemCaptureId) {
  return Like.scope('gemCapture').count({
    where: {
      entityId: gemCaptureId,
    },
  });
}

async function countByGemCaptureIds(gemCaptureIds) {
  const results = await Like.scope('gemCapture').findAll({
    where: {
      entityId: {
        [Op.in]: gemCaptureIds,
      },
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
  return Like.scope('gemCapture').findAll({
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
  createGemCaptureLike,
  findyByUserIdAndGemCaptureId,
  findByGemCaptureId,
  findByGemCaptureIdsAndUserId,
  deleteByUserIdAndGemCaptureId,
  deleteByGemCaptureId,
  deleteByGemCaptureIds,
  countByGemCaptureId,
  countByGemCaptureIds,
};
