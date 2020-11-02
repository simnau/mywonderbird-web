const { Op } = require('sequelize');

const { getGeohash } = require('../../util/geo');
const { Place } = require('../../orm/models/place');
const { PlaceImage } = require('../../orm/models/place-image');
const { PlaceTag } = require('../../orm/models/place-tag');
const { Tag } = require('../../orm/models/tag');
const placeImageService = require('../place-image/service');
const geoService = require('../geo/service');
const tagService = require('../tag/service');
const { unique, flatMap, indexBy } = require('../../util/array');

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

async function findPlacesByQuestionnaire(params) {
  const tagIds = (await Tag.findAll({
    where: {
      code: {
        [Op.in]: params.types,
      },
    },
  })).map(tag => tag.id);
  const include = [
    {
      model: PlaceImage,
      as: 'placeImages',
    },
    {
      model: PlaceTag,
      as: 'placeTags',
      where: {
        tagId: {
          [Op.in]: tagIds,
        },
      },
    },
  ];

  return Place.findAll({
    where: {
      countryCode: params.country,
    },
    include,
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

async function findAllPaginated({ page, pageSize }) {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  const include = [
    {
      model: PlaceImage,
      as: 'placeImages',
    },
    {
      model: PlaceTag,
      as: 'placeTags',
    },
  ];

  const { count: total, rows: places } = await Place.findAndCountAll({
    include,
    offset,
    limit,
    order: [['updatedAt', 'DESC']],
  });

  return { places, total };
}

async function toDTOs(places) {
  const tagIds = unique(
    flatMap(places, place => place.placeTags.map(tag => tag.tagId)),
  );
  const tags = await tagService.findByIds(tagIds);
  const tagsById = indexBy(tags, 'id');

  return places.map(place => {
    return {
      ...place.toJSON ? place.toJSON() : place,
      country: geoService.getLabelBy3LetterCountryCode(place.countryCode),
      placeTags: place.placeTags.map((placeTag) => {
        return {
          ...placeTag.toJSON ? placeTag.toJSON() : placeTag,
          tag: tagsById[placeTag.tagId],
        };
      }),
    };
  });
}

module.exports = {
  createFromGem,
  findByGeohash,
  findByCountryCode,
  findPlacesByQuestionnaire,
  findByIds,
  findAllPaginated,
  toDTOs,
};
