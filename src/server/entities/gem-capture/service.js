const { Op } = require('sequelize');
const uuidv4 = require('uuid/v4');

const { uploadFile } = require('../../util/file-upload');
const { Gem } = require('../../orm/models/gem');
const { Like } = require('../../orm/models/like');
const { Journey } = require('../../orm/models/journey');
const { GemCapture } = require('../../orm/models/gem-capture');
const {
  OLDER_DIRECTION,
  NEWER_DIRECTION,
} = require('../../constants/infinite-scroll');

const INCLUDE_MODELS = [
  {
    model: Gem,
    include: [
      {
        model: Journey,
      },
    ],
  },
];

const INCLUDE_MODELS_FEED = [
  {
    model: Gem,
    where: {
      journeyId: {
        [Op.ne]: null,
      },
    },
    include: [
      {
        model: Journey,
      },
    ],
  },
];

const INCLUDE_MODELS_FEED_V2 = [
  {
    model: Gem,
    include: [
      {
        model: Journey,
      },
    ],
  },
];

async function uploadFiles(files, folder) {
  return uploadFile(files, folder);
}

async function deleteByIds(ids, transaction) {
  // Not using the likeService as it creates a circular loop through the notification service...
  await Like.destroy(
    {
      where: {
        entityId: {
          [Op.in]: ids,
        },
      },
    },
    { transaction },
  );

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
    include: INCLUDE_MODELS_FEED,
  });
}

async function findFeedItemsV2(
  lastDatetime,
  limit,
  direction = OLDER_DIRECTION,
) {
  let where = {
    // HACK: we only want to show a picture once for each gem
    // the first picture for a gem will always be with the sequenceNumber of 0
    sequenceNumber: 0,
  };
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
    include: INCLUDE_MODELS_FEED_V2,
  });
}

function findById(id, { includeModels = false } = {}) {
  if (includeModels) {
    return GemCapture.findByPk(id, {
      include: INCLUDE_MODELS,
    });
  }

  return GemCapture.findByPk(id);
}

function findByIds(ids) {
  return GemCapture.findAll({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
    include: INCLUDE_MODELS,
  });
}

module.exports = {
  uploadFiles,
  updateGemCaptures,
  findFeedItems,
  findFeedItemsV2,
  findById,
  findByIds,
};
