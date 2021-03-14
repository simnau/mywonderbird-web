const { Op } = require('sequelize');
const axios = require('axios');

const { uploadFileArray } = require('../../util/file-upload');
const sequelize = require('../../setup/sequelize');
const { getGeohash } = require('../../util/geo');
const { Place } = require('../../orm/models/place');
const { PlaceImage } = require('../../orm/models/place-image');
const { PlaceTag } = require('../../orm/models/place-tag');
const { Tag } = require('../../orm/models/tag');
const placeImageService = require('../place-image/service');
const geoService = require('../geo/service');
const tagService = require('../tag/service');
const placeTagService = require('../place-tag/service');
const { unique, flatMap, indexBy } = require('../../util/array');
const { getPlaceImagesDirectory } = require('../../util/file');
const { Readable } = require('stream');
const csv = require('csv-parser');
const {
  LITHUANIA_BOTTOM_RIGHT,
  LITHUANIA_TOP_LEFT,
} = require('../../constants/coordinates');

const INCLUDE_MODELS = [
  {
    model: PlaceImage,
    as: 'placeImages',
  },
];

// const MAX_LOCATIONS_TO_SUGGEST = 40;

function findByGeohash(geohash, { includeDeleted = false } = {}) {
  const where = {
    geohash: {
      [Op.iLike]: `${geohash}%`,
    },
  };

  if (!includeDeleted) {
    where.deletedAt = null;
  }

  return Place.findOne({
    where,
  });
}

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

async function findPlacesPaginated(
  { page, pageSize, tags },
  { includeDeleted = false } = {},
) {
  const include = [
    {
      model: PlaceImage,
      as: 'placeImages',
    },
  ];

  if (tags && tags.length) {
    const tagsForCodes = await Tag.findAll({
      where: {
        code: {
          [Op.in]: tags,
        },
      },
      attributes: ['id'],
    })
    const tagIds = tagsForCodes.map(tag => tag.id);

    if (tagIds.length) {
      include.push({
        model: PlaceTag,
        as: 'placeTags',
        where: {
          tagId: {
            [Op.in]: tagIds,
          },
        },
      });
    }
  }

  const where = addTemporaryPlaceFilters({});

  if (!includeDeleted) {
    where.deletedAt = null;
  }

  const result = await Place.findAll({
    where,
    include,
    offset: page * pageSize,
    limit: pageSize,
    order: [['createdAt', 'DESC']],
  });

  return result;
}

async function findPlacesByQuestionnaire(
  params,
  { includeDeleted = false } = {},
) {
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

  let where = {
    countryCode: params.country,
  };

  if (!includeDeleted) {
    where.deletedAt = null;
  }

  where = addTemporaryPlaceFilters(where);

  return Place.findAll({
    where,
    include,
    // TODO: Add in some sort of limit when we figure out how to randomize the list from the database
    // while allowing proper pagination
    // limit: MAX_LOCATIONS_TO_SUGGEST,
    order: [['updatedAt', 'DESC']],
  });
}

async function findById(id) {
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

  return Place.findByPk(id, {
    include,
  });
}

async function findByLocation({ lat, lng }, { includeDeleted = false } = {}) {
  const geohash = getGeohash(lat, lng);

  return findByGeohash(geohash, { includeDeleted });
}

async function findByIds(ids, { includeDeleted = false } = {}) {
  const where = {
    id: {
      [Op.in]: ids,
    },
  };

  if (!includeDeleted) {
    where.deletedAt = null;
  }

  return Place.findAll({
    where,
    include: INCLUDE_MODELS,
  });
}

async function findAllPaginated(
  { page, pageSize, q, countryCode, tags },
  { includeDeleted = false } = {},
) {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const tagWhere = {};
  const where = {};

  if (q) {
    where.title = {
      [Op.iLike]: `%${q}%`,
    };
  }

  if (countryCode) {
    where.countryCode = countryCode;
  }

  if (!includeDeleted) {
    where.deletedAt = null;
  }

  if (tags) {
    const tagIds = (await tagService.findByCodes(tags)).map(tag => tag.id);

    tagWhere.tagId = {
      [Op.in]: tagIds,
    };
  }

  const include = [
    {
      model: PlaceImage,
      as: 'placeImages',
    },
    {
      model: PlaceTag,
      as: 'placeTags',
      where: Object.keys(tagWhere).length ? tagWhere : null,
    },
  ];

  const places = await Place.findAll({
    where,
    include,
    offset,
    limit,
    order: [['updatedAt', 'DESC']],
  });
  const total = await Place.count({ where });

  return { places, total };
}

async function createFull(place) {
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
  const { lat, lng } = place;
  const geohash = getGeohash(lat, lng);
  const existingPlace = await findByGeohash(geohash);

  if (existingPlace) {
    const error = new Error('Place already exists');
    error.status = 409;
    throw error;
  }

  return Place.create(
    {
      ...place,
      geohash,
    },
    {
      include,
    },
  );
}

async function createFromCSV(csvFile, userId) {
  const stream = new Readable({ read() {} });

  stream.push(csvFile.data);
  stream.push(null);

  const promises = [];

  await new Promise((resolve, reject) => {
    stream
      .pipe(csv())
      .on('data', data => {
        promises.push(createFromCSVData(data, userId));
      })
      .on('error', error => reject(error))
      .on('end', async () => {
        await Promise.all(promises);
        resolve();
      });
  });
}

async function createFromCSVData(csvPlace, userId) {
  const {
    title,
    location,
    source,
    country_code,
    tags: tagsString,
    image_urls,
  } = csvPlace;

  const [lat, lng] = location.split(';');

  const geohash = getGeohash(lat, lng);

  const existingPlace = await findByGeohash(geohash);

  if (existingPlace) {
    return;
  }

  const tagCodes = tagsString.split(';');
  const imageUrls = image_urls.split(';');

  const tags = await tagService.findByCodes(tagCodes);
  const tagsByCode = indexBy(tags, 'code');

  const placeTags = [];

  for (const tagCode of tagCodes) {
    const tag = tagsByCode[tagCode];

    if (!tag) {
      continue;
    }

    placeTags.push({
      tagId: tag.id,
    });
  }

  const place = {
    title,
    lat,
    lng,
    source,
    countryCode: country_code,
    placeTags,
  };

  const createdPlace = await createFull(place);
  await createPlaceImagesFromImageUrls(
    imageUrls,
    createdPlace.id,
    userId,
    title,
  );

  return createdPlace;
}

async function createPlaceImagesFromImageUrls(
  imageUrls,
  placeId,
  userId,
  title,
) {
  const imageBuffers = await Promise.all(
    imageUrls.map(async imageUrl => {
      const response = await axios({
        method: 'get',
        url: imageUrl,
        responseType: 'arraybuffer',
      });

      return response.data;
    }),
  );
  const { images } = await uploadFileArray(
    imageBuffers,
    getPlaceImagesDirectory(placeId),
  );
  await placeImageService.createForPlace(
    placeId,
    images.map(image => ({ url: image, title, userId })),
  );
}

async function update(id, place) {
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
  const { lat, lng } = place;
  const geohash = getGeohash(lat, lng);
  const geohashPlace = await findByGeohash(geohash);

  if (geohashPlace && geohashPlace.id !== id) {
    throw new Error('Place already exists');
  }

  const existingPlace = await findById(id);

  return sequelize.transaction(async transaction => {
    await placeImageService.updateAll(
      id,
      place.placeImages,
      existingPlace.placeImages,
      {
        transaction,
      },
    );
    await placeTagService.updateAll(
      id,
      place.placeTags,
      existingPlace.placeTags,
      {
        transaction,
      },
    );
    return existingPlace.update(
      {
        ...place,
        geohash,
      },
      {
        include,
        transaction,
      },
    );
  });
}

// Not actually deleting the place in case it was used in a Saved Trip
async function deleteById(id) {
  return Place.update(
    {
      deletedAt: new Date(),
    },
    {
      where: {
        id,
      },
    },
  );
}

async function toDTOs(places) {
  const tagIds = unique(
    flatMap(places, place => place.placeTags.map(tag => tag.tagId)),
  );
  const tags = await tagService.findByIds(tagIds);
  const tagsById = indexBy(tags, 'id');

  return places.map(place => {
    return {
      ...(place.toJSON ? place.toJSON() : place),
      country: geoService.getLabelBy3LetterCountryCode(place.countryCode),
      placeTags: place.placeTags.map(placeTag => {
        return {
          ...(placeTag.toJSON ? placeTag.toJSON() : placeTag),
          tag: tagsById[placeTag.tagId],
        };
      }),
    };
  });
}

async function toDTO(place) {
  const tagIds = place.placeTags.map(tag => tag.tagId);
  const tags = await tagService.findByIds(tagIds);
  const tagsById = indexBy(tags, 'id');

  return {
    ...(place.toJSON ? place.toJSON() : place),
    country: geoService.getLabelBy3LetterCountryCode(place.countryCode),
    placeTags: place.placeTags.map(placeTag => {
      return {
        ...(placeTag.toJSON ? placeTag.toJSON() : placeTag),
        tag: tagsById[placeTag.tagId],
      };
    }),
  };
}

// Temporary filters to only select locations from Lithuania
function addTemporaryPlaceFilters(where) {
  return {
    ...where,
    lat: {
      [Op.between]: [LITHUANIA_BOTTOM_RIGHT.lat, LITHUANIA_TOP_LEFT.lat],
    },
    lng: {
      [Op.between]: [LITHUANIA_TOP_LEFT.lng, LITHUANIA_BOTTOM_RIGHT.lng],
    },
  };
}

module.exports = {
  createFull,
  createFromCSV,
  createFromCSVData,
  createFromGem,
  findByGeohash,
  findPlacesByQuestionnaire,
  findById,
  findByLocation,
  findByIds,
  findAllPaginated,
  deleteById,
  update,
  toDTOs,
  toDTO,

  findPlacesPaginated,
};
