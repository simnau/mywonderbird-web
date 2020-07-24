const { Op } = require('sequelize');
const uuidv4 = require('uuid/v4');

const fileUploader = require('../../util/file-upload');
const { Gem } = require('../../orm/models/gem');
const { GemCapture } = require('../../orm/models/gem-capture');
const {
  OLDER_DIRECTION,
  NEWER_DIRECTION,
} = require('../../constants/infinite-scroll');

const INCLUDE_MODELS = [
  {
    model: Gem,
  },
];

async function uploadFiles(files, folder) {
  const { images } = await fileUploader(files, folder);

  return {
    images,
  };
}

function deleteByIds(ids, transaction) {
  return GemCapture.destroy({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
    transaction,
  });
}

function bulkCreate(gemCaptures, transaction) {
  return GemCapture.bulkCreate(gemCaptures, { transaction });
}

function update(gemCaptures, transaction) {
  return Promise.all(
    gemCaptures.map(async gemCapture =>
      GemCapture.update(gemCapture, {
        where: { id: gemCapture.id },
        transaction,
      }),
    ),
  );
}

async function updateGemCaptures(
  existingGemCaptures,
  gemCaptureUpdates,
  gemId,
  transaction,
) {
  const gemCapturesToDeleteIds = existingGemCaptures
    .filter(existingGemCapture => {
      return !gemCaptureUpdates.find(
        gemCaptureUpdate => gemCaptureUpdate.id === existingGemCapture.id,
      );
    })
    .map(gemToDelete => gemToDelete.id);
  const gemCapturesToCreate = gemCaptureUpdates
    .filter(
      gemCaptureUpdate =>
        !existingGemCaptures.find(
          existingGemCapture => existingGemCapture.id === gemCaptureUpdate.id,
        ),
    )
    .map(gemCaptureUpdate => ({ ...gemCaptureUpdate, id: uuidv4(), gemId }));
  const gemCapturesToUpdate = gemCaptureUpdates.filter(
    gemCaptureUpdate =>
      !!gemCaptureUpdate.id &&
      !!existingGemCaptures.find(
        existingGemCapture => existingGemCapture.id === gemCaptureUpdate.id,
      ),
  );

  await Promise.all([
    deleteByIds(gemCapturesToDeleteIds, transaction),
    bulkCreate(gemCapturesToCreate, transaction),
    update(gemCapturesToUpdate, transaction),
  ]);
}

async function findFeedItems(lastDatetime, limit, direction = OLDER_DIRECTION) {
  let where = {};
  let order;

  if (direction === NEWER_DIRECTION) {
    if (lastDatetime) {
      where = {
        updatedAt: {
          [Op.gt]: lastDatetime,
        },
      };
    }
    order = [['updatedAt', 'ASC']];
  } else {
    if (lastDatetime) {
      where = {
        updatedAt: {
          [Op.lt]: lastDatetime,
        },
      };
    }
    order = [['updatedAt', 'DESC']];
  }

  return GemCapture.findAll({
    where,
    limit,
    order,
    include: INCLUDE_MODELS,
  });
}

module.exports = {
  uploadFiles,
  updateGemCaptures,
  findFeedItems,
};
