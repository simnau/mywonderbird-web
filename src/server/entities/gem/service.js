const { Op } = require('sequelize');
const uuidv4 = require('uuid/v4');

const { Gem } = require('../../orm/models/gem');
const { GemCapture } = require('../../orm/models/gem-capture');
const gemCaptureService = require('../gem-capture/service');
const placeService = require('../place/service');
const geoService = require('../geo/service');
const { getGeohash } = require('../../util/geo');
const { imagePathToImageUrl } = require('../../util/file-upload');
const { deleteFile } = require('../../util/s3');
const sequelize = require('../../setup/sequelize');

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

async function updateDayGems(
  existingGems,
  gemUpdates = [],
  dayId,
  transaction,
) {
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

async function findLastForJourney(journeyId) {
  const [lastGem] = await Gem.findAll({
    where: {
      journeyId,
    },
    order: [['sequenceNumber', 'DESC']],
    limit: 1,
  });

  return lastGem;
}

async function create(gem, transaction = null) {
  return Gem.create(gem, {
    include: INCLUDE_MODELS,
    transaction,
  });
}

async function bulkCreate(gems, transaction = null) {
  return Gem.bulkCreate(gems, {
    include: INCLUDE_MODELS,
    transaction,
    returning: true,
  });
}

async function update(id, updateObject, transaction = null) {
  return Gem.update(updateObject, {
    where: {
      id,
    },
    transaction,
  });
}

async function getGemCountry(gem) {
  if (gem.countryCode) {
    return geoService.getLabelBy3LetterCountryCode(gem.countryCode);
  }

  let place;

  if (gem) {
    const geohash = getGeohash(gem.lat, gem.lng);
    place = await placeService.findByGeohash(geohash);
  }

  if (!place) {
    return null;
  }

  await update(gem.id, { countryCode: place.countryCode });

  return geoService.getLabelBy3LetterCountryCode(place.countryCode);
}

async function findById(id) {
  return Gem.findByPk(id, {
    include: INCLUDE_MODELS,
  });
}

async function findStandaloneByUserId(userId) {
  return Gem.findAll({
    where: {
      userId,
      journeyId: null,
    },
    order: [['updatedAt', 'DESC']],
    include: INCLUDE_MODELS,
  });
}

async function del(gem) {
  return sequelize.transaction(async transaction => {
    return Promise.all([
      Gem.destroy({
        where: { id: gem.id },
        transaction,
      }),
      deleteImages(gem),
    ]);
  });
}

async function deleteImages(gem) {
  return Promise.all(
    gem.gemCaptures.map(async gemCapture => {
      return deleteFile(gemCapture.imagePath);
    }),
  );
}

function toDTO(gem) {
  const country = geoService.getLabelBy3LetterCountryCode(gem.countryCode);

  const images = gem.gemCaptures.map(gemCapture => {
    return gemCapture.imagePath
      ? imagePathToImageUrl(gemCapture.imagePath)
      : gemCapture.url;
  });

  const imageUrl = images.length ? images[0] : null;

  return {
    id: gem.id,
    name: gem.title,
    countryCode: gem.countryCode,
    country,
    imageUrl,
    images,
    location: {
      lat: gem.lat,
      lng: gem.lng,
    },
  };
}

module.exports = {
  updateDayGems,
  create,
  bulkCreate,
  update,
  findLastForJourney,
  getGemCountry,
  findById,
  findStandaloneByUserId,
  delete: del,
  toDTO,
};
