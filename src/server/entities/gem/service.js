const { Op } = require('sequelize');
const uuidv4 = require('uuid/v4');

const { Gem } = require('../../orm/models/gem');
const { GemCapture } = require('../../orm/models/gem-capture');
const gemCaptureService = require('../gem-capture/service');

const INCLUDE_MODELS = [
  {
    model: GemCapture,
    as: 'gemCaptures',
  },
];

function updateCaptures(existingGemsById, gemUpdates, transaction) {
  return Promise.all(
    gemUpdates.map(gemUpdate => {
      const existingGem = existingGemsById[gemUpdate.id];

      return gemCaptureService.updateGemCaptures(
        existingGem.gemCaptures,
        gemUpdate.gemCaptures,
        gemUpdate.id,
        transaction,
      );
    }),
  );
}

function deleteByIds(ids, transaction) {
  return Gem.destroy({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
    transaction,
  });
}

function bulkCreate(gems, transaction) {
  return Gem.bulkCreate(gems, { include: INCLUDE_MODELS, transaction });
}

function update(gems, transaction) {
  return Promise.all(
    gems.map(async gem =>
      Gem.update(gem, { where: { id: gem.id }, transaction }),
    ),
  );
}

async function updateDayGems(existingGems, gemUpdates, dayId, transaction) {
  const gemsToDeleteIds = existingGems
    .filter(existingGem => {
      return !gemUpdates.find(gemUpdate => gemUpdate.id === existingGem.id);
    })
    .map(gemToDelete => gemToDelete.id);
  const gemsToCreate = gemUpdates
    .filter(
      gemUpdate =>
        !existingGems.find(existingGem => existingGem.id === gemUpdate.id),
    )
    .map(gemUpdate => ({ ...gemUpdate, id: uuidv4(), dayId }));
  const gemsToUpdate = gemUpdates.filter(
    gemUpdate =>
      !!gemUpdate.id &&
      !!existingGems.find(existingGem => existingGem.id === gemUpdate.id),
  );
  const existingGemsById = existingGems.reduce(
    (acc, existingGem) => ({ ...acc, [existingGem.id]: existingGem }),
    {},
  );

  await Promise.all([
    updateCaptures(existingGemsById, gemsToUpdate, transaction),
    deleteByIds(gemsToDeleteIds, transaction),
    bulkCreate(gemsToCreate, transaction),
    update(gemsToUpdate, transaction),
  ]);
}

module.exports = {
  updateDayGems,
};
