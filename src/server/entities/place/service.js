const { Op } = require('sequelize');

const { getGeohash } = require('../../util/geo');
const { Place } = require('../../orm/models/place');
const { PlaceImage } = require('../../orm/models/place-image');
const placeImageService = require('../place-image/service');
const geoService = require('../geo/service');

const INCLUDE_MODELS = [
  {
    model: PlaceImage,
    as: 'placeImages',
  },
];

function findByGeohash(geohash) {
  return Place.findOne({
    where: {
      geohash,
    },
  });
}
const MAX_LOCATIONS_TO_SUGGEST = 40;

async function createImagesForExisting(
  place,
  gemCaptures,
  userId,
  transaction = null,
) {
  const placeImages = gemCaptures.map(gemCapture =>
    placeImageService.fromGemCapture(gemCapture, userId, place.id),
  );

  return placeImageService.bulkCreate(placeImages, transaction);
}

async function fromGem(gem, location, userId) {
  const { lat, lng } = gem;
  const { title } = location;
  let { countryCode } = location;

  if (!countryCode && (lat || lat == 0) && (lng || lng == 0)) {
    const location = `${lat},${lng}`;
    const herePlace = await geoService.locationToAddress(location);

    if (herePlace) {
      countryCode = herePlace.countryCode;
    }
  }

  if (!countryCode) {
    return null;
  }

  const place = {
    title,
    countryCode,
    lat: lat,
    lng: lng,
    geohash: getGeohash(lat, lng),
    placeImages: gem.gemCaptures.map(gemCapture =>
      placeImageService.fromGemCapture(gemCapture, userId),
    ),
  };

  return place;
}

async function create(place, transaction = null) {
  return Place.create(place, {
    include: INCLUDE_MODELS,
    transaction,
  });
}

async function createFromGem(gem, location, userId, transaction = null) {
  if (!gem) {
    return;
  }

  const { lat, lng } = gem;
  const geohash = getGeohash(lat, lng);
  const existingPlace = await findByGeohash(geohash);

  if (existingPlace) {
    await createImagesForExisting(
      existingPlace,
      gem.gemCaptures,
      userId,
      transaction,
    );
  } else {
    const place = await fromGem(gem, location, userId);
    if (place) {
      await create(place, transaction);
    }
  }
}

async function findByCountryCode(countryCode) {
  return Place.findAll({
    where: {
      countryCode,
    },
    include: INCLUDE_MODELS,
    limit: MAX_LOCATIONS_TO_SUGGEST,
    order: [['updatedAt', 'DESC']],
  });
}

async function findByIds(ids) {
  return Place.findAll({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
    include: INCLUDE_MODELS,
  });
}

module.exports = {
  createFromGem,
  findByGeohash,
  findByCountryCode,
  findByIds,
};
