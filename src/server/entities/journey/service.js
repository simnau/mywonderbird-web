const { Op } = require('sequelize');
const config = require('config');

const sequelize = require('../../setup/sequelize');
const { Journey } = require('../../orm/models/journey');
const { Day } = require('../../orm/models/day');
const { Gem } = require('../../orm/models/gem');
const { GemCapture } = require('../../orm/models/gem-capture');
const { Nest } = require('../../orm/models/nest');
const dayService = require('../day/service');
const profileService = require('../profile/service');
const favoriteJourneyService = require('../favorite-journey/service');
const { deleteFolder } = require('../../util/s3');
const { findCoordinateBoundingBox } = require('../../util/geo');
const { unique } = require('../../util/array');
const journeyCommentService = require('../journey-comment/service');
const journeyLikeService = require('../journey-like/service');
const placeService = require('../place/service');
const geoService = require('../geo/service');
const { getGeohash } = require('../../util/geo');

const feedMaxImageCount = config.get('feed.maxImageCount');

const INCLUDE_MODELS = [
  {
    model: Day,
    as: 'days',
    include: [
      {
        model: Gem,
        as: 'gems',
        include: [
          {
            model: GemCapture,
            as: 'gemCaptures',
          },
        ],
      },
      {
        model: Nest,
        as: 'nest',
      },
    ],
  },
];

const INCLUDE_ORDER = [
  [{ model: Day, as: 'days' }, 'dayNumber', 'ASC'],
  [
    { model: Day, as: 'days' },
    { model: Gem, as: 'gems' },
    'sequenceNumber',
    'ASC',
  ],
  [
    { model: Day, as: 'days' },
    { model: Gem, as: 'gems' },
    { model: GemCapture, as: 'gemCaptures' },
    'sequenceNumber',
    'ASC',
  ],
];

const INCLUDE_MODELS_V2 = [
  {
    model: Gem,
    as: 'gems',
    include: [
      {
        model: GemCapture,
        as: 'gemCaptures',
      },
    ],
  },
];

const INCLUDE_ORDER_V2 = [
  [{ model: Gem, as: 'gems' }, 'createdAt', 'ASC'],
  [
    { model: Gem, as: 'gems' },
    { model: GemCapture, as: 'gemCaptures' },
    'createdAt',
    'ASC',
  ],
];

async function findAll(
  page,
  pageSize,
  { loadIncludes = false, published = false, draft = false } = {},
) {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  const where = { draft };

  if (published) {
    where.published = published;
  }

  if (loadIncludes) {
    const [total, journeys] = await Promise.all([
      Journey.count({ where }),
      Journey.findAll({
        where,
        order: [['createdAt', 'DESC'], ...INCLUDE_ORDER],
        include: INCLUDE_MODELS,
        offset,
        limit,
      }),
    ]);

    return { total, journeys };
  }

  const { count: total, rows: journeys } = await Journey.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    offset,
    limit,
  });

  return { total, journeys };
}

async function findAllByUser(
  userId,
  page,
  pageSize,
  { loadIncludes = false, published = false, draft = false } = {},
) {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  const where = { userId, draft };

  if (published) {
    where.published = published;
  }

  if (loadIncludes) {
    const [total, journeys] = await Promise.all([
      Journey.count({
        where,
      }),
      Journey.findAll({
        where,
        order: [['createdAt', 'DESC'], ...INCLUDE_ORDER],
        include: INCLUDE_MODELS,
        offset,
        limit,
      }),
    ]);

    return { total, journeys };
  }

  const { count: total, rows: journeys } = await Journey.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    offset,
    limit,
  });

  return { total, journeys };
}

async function findAllByUserV2(
  userId,
  page,
  pageSize,
  { loadIncludes = false } = {},
) {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  const where = { userId };

  if (loadIncludes) {
    const [total, journeys] = await Promise.all([
      Journey.count({
        where,
      }),
      Journey.findAll({
        where,
        order: [['createdAt', 'DESC'], ...INCLUDE_ORDER_V2],
        include: INCLUDE_MODELS_V2,
        offset,
        limit,
      }),
    ]);

    return { total, journeys };
  }

  const { count: total, rows: journeys } = await Journey.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    offset,
    limit,
  });

  return { total, journeys };
}

async function findLastByUser(
  userId,
  { loadIncludes = false, published = false, draft = false } = {},
) {
  const where = { userId, draft };

  if (published) {
    where.published = published;
  }

  if (loadIncludes) {
    const [lastJourney] = await Journey.findAll({
      where,
      order: [['createdAt', 'DESC'], ...INCLUDE_ORDER],
      include: INCLUDE_MODELS,
      limit: 1,
    });

    return lastJourney.toJSON();
  }

  const [lastJourney] = await Journey.findAll({
    where,
    order: [['createdAt', 'DESC']],
    limit: 1,
  });

  return lastJourney.toJSON();
}

async function findAllByIds(
  ids,
  page,
  pageSize,
  { loadIncludes = false, published = false, draft = false } = {},
) {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;
  const where = { id: { [Op.in]: ids }, draft };

  if (published) {
    where.published = published;
  }

  if (loadIncludes) {
    const [total, journeys] = await Promise.all([
      Journey.count({
        where,
      }),
      Journey.findAll({
        where,
        order: [['createdAt', 'DESC'], ...INCLUDE_ORDER],
        include: INCLUDE_MODELS,
        offset,
        limit,
      }),
    ]);

    return { total, journeys };
  }

  const { count: total, rows: journeys } = await Journey.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    offset,
    limit,
  });

  return { total, journeys };
}

async function findCountByUser(userId) {
  return Journey.count({
    where: {
      userId,
      draft: false,
    },
  });
}

async function findDraftCountByUser(userId) {
  return Journey.count({
    where: {
      userId,
      draft: true,
    },
  });
}

async function findAllNotByUser(
  userId,
  page,
  pageSize,
  { loadIncludes = false } = {},
) {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  if (loadIncludes) {
    const [total, journeys] = await Promise.all([
      Journey.count({
        where: {
          userId: {
            [Op.ne]: userId,
          },
        },
      }),
      Journey.findAll({
        where: {
          userId: {
            [Op.ne]: userId,
          },
        },
        order: [['createdAt', 'DESC'], ...INCLUDE_ORDER],
        include: INCLUDE_MODELS,
        offset,
        limit,
      }),
    ]);

    return { total, journeys };
  }

  const { count: total, rows: journeys } = await Journey.findAndCountAll({
    where: {
      userId: {
        [Op.ne]: userId,
      },
    },
    order: [['createdAt', 'DESC']],
    offset,
    limit,
  });

  return { total, journeys };
}

function findById(id) {
  return Journey.findByPk(id, {
    include: INCLUDE_MODELS,
    order: INCLUDE_ORDER,
  });
}

function publish(id) {
  return Journey.update(
    {
      published: true,
    },
    { where: { id } },
  );
}

function unpublish(id) {
  return Journey.update(
    {
      published: false,
    },
    { where: { id } },
  );
}

function create(journey) {
  return sequelize.transaction(transaction => {
    return Journey.create(journey, {
      include: INCLUDE_MODELS,
      transaction,
    });
  });
}

async function update(id, journeyUpdate, existingJourney) {
  return sequelize.transaction(async transaction => {
    await dayService.updateDays(
      existingJourney.days,
      journeyUpdate.days,
      id,
      transaction,
    );
    await existingJourney.update(journeyUpdate, { transaction });
  });
}

async function del(id) {
  return sequelize.transaction(async transaction => {
    return Promise.all([
      Journey.destroy({
        where: { id },
        transaction,
      }),
      deleteFolder(id),
    ]);
  });
}

async function addUserProfileToJourneys(journeys) {
  const uniqueUserIds = unique(journeys.map(journey => journey.userId));
  const userProfiles = await profileService.findOrCreateProfilesByProviderIds(
    uniqueUserIds,
  );
  const profilesById = userProfiles.reduce(
    (result, profile) => ({
      ...result,
      [profile.providerId]: profile,
    }),
    {},
  );

  return journeys.map(journey => {
    const journeyData = journey.toJSON ? journey.toJSON() : journey;
    const profile = profilesById[journeyData.userId] || {};
    return {
      ...journeyData,
      userProfile: profile,
    };
  });
}

async function addUserProfileToJourney(journey) {
  const userProfile = await profileService.findProfileByProviderId(
    journey.userId,
  );

  const journeyData = journey.toJSON ? journey.toJSON() : journey;
  return {
    ...journeyData,
    userProfile: userProfile || {},
  };
}

function journeyToFeedJourneyDTO(journey) {
  const { days, ...journeyData } = journey;

  const images = [];
  const coordinates = [];

  for (const day of days) {
    for (const gem of day.gems) {
      if (
        images.length < feedMaxImageCount &&
        gem.gemCaptures &&
        gem.gemCaptures.length &&
        gem.gemCaptures[0].url
      ) {
        images.push(gem.gemCaptures[0].url);
      }

      coordinates.push({
        id: gem.id,
        lat: gem.lat,
        lng: gem.lng,
        type: 'gem',
      });
    }

    if (day.nest) {
      coordinates.push({
        id: day.nest.id,
        lat: day.nest.lat,
        lng: day.nest.lng,
        type: 'nest',
      });
    }
  }

  const boundingBox = findCoordinateBoundingBox(coordinates);

  return {
    ...journeyData,
    images,
    coordinates,
    length: days.length,
    boundingBox,
  };
}

async function addIsFavoriteToJourneys(journeys, userId) {
  const journeyIds = journeys.map(journey => journey.id);
  const favoriteJourneys = await favoriteJourneyService.findByJourneyIdsAndUserId(
    journeyIds,
    userId,
  );
  const favoriteJourneysByJourneyId = favoriteJourneys.reduce(
    (result, favoriteJourney) => ({
      ...result,
      [favoriteJourney.journeyId]: favoriteJourney,
    }),
    {},
  );

  return journeys.map(journey => {
    const favoriteJourney = favoriteJourneysByJourneyId[journey.id];

    return {
      ...journey,
      isFavorite: !!favoriteJourney,
    };
  });
}

async function addIsLikedToJourneys(journeys, userId) {
  const journeyIds = journeys.map(journey => journey.id);
  const likedJourneys = await journeyLikeService.findByJourneyIdsAndUserId(
    journeyIds,
    userId,
  );
  const likedJourneysByJourneyId = likedJourneys.reduce(
    (result, likedJourney) => ({
      ...result,
      [likedJourney.journeyId]: likedJourney,
    }),
    {},
  );

  return journeys.map(journey => {
    const likedJourney = likedJourneysByJourneyId[journey.id];

    return {
      ...journey,
      isLiked: !!likedJourney,
    };
  });
}

async function addCommentCountToJourneys(journeys) {
  return Promise.all(
    journeys.map(async journey => {
      const journeyData = journey.toJSON ? journey.toJSON() : journey;
      const commentCount = await journeyCommentService.countByJourneyId(
        journeyData.id,
      );

      return {
        ...journeyData,
        commentCount,
      };
    }),
  );
}

async function addLikeCountToJourneys(journeys) {
  return Promise.all(
    journeys.map(async journey => {
      const journeyData = journey.toJSON ? journey.toJSON() : journey;
      const likeCount = await journeyLikeService.countByJourneyId(
        journeyData.id,
      );

      return {
        ...journeyData,
        likeCount,
      };
    }),
  );
}

async function enrichJourneys(journeys, userId) {
  const journeysWithProfile = await addUserProfileToJourneys(journeys);
  const journeysWithFavorites = await addIsFavoriteToJourneys(
    journeysWithProfile,
    userId,
  );
  const journeysWithLikes = await addIsLikedToJourneys(
    journeysWithFavorites,
    userId,
  );
  const journeysWithCommentCount = await addCommentCountToJourneys(
    journeysWithLikes,
  );
  const journeysWithLikeCount = await addLikeCountToJourneys(
    journeysWithCommentCount,
  );

  return journeysWithLikeCount.map(journeyToFeedJourneyDTO);
}

async function enrichJourneysV2(journeys) {
  const journeyDTOs = journeys.map(journeyToFeedJourneyDTOV2);
  return addCountriesToJourneyDTOs(journeyDTOs);
}

function journeyToFeedJourneyDTOV2(journey) {
  const rawJourney = journey.toJSON ? journey.toJSON() : journey;
  const { gems, ...journeyData } = rawJourney;

  const images = [];
  const coordinates = [];

  for (const gem of gems) {
    for (const gemCapture of gem.gemCaptures) {
      images.push(gemCapture.url);
    }

    coordinates.push({
      id: gem.id,
      lat: gem.lat,
      lng: gem.lng,
      type: 'gem',
    });
  }

  const boundingBox = findCoordinateBoundingBox(coordinates);

  return {
    ...journeyData,
    images,
    coordinates,
    boundingBox,
  };
}

async function addCountriesToJourneyDTOs(journeyDTOs) {
  const journeyFirstPointGeohashes = journeyDTOs.map(journeyDTO => {
    const firstPoint = journeyDTO.coordinates.length
      ? journeyDTO.coordinates[0]
      : null;

    if (!firstPoint) {
      return null;
    }

    return getGeohash(firstPoint.lat, firstPoint.lng);
  });

  const journeyPlaces = await Promise.all(
    journeyFirstPointGeohashes.map(
      geohash => geohash && placeService.findByGeohash(geohash),
    ),
  );

  return journeyDTOs.map((journeyDTO, index) => {
    const place = journeyPlaces[index];

    return {
      ...journeyDTO,
      country:
        place &&
        place.countryCode &&
        geoService.getLabelBy3LetterCountryCode(place.countryCode),
    };
  });
}

function validateJourney(journey) {
  const errors = {};

  if (!journey.title) {
    errors.title = 'Journey title is required';
  }

  if (!journey.startDate) {
    errors.startDate = 'Journey start date is required';
  }

  return errors;
}

module.exports = {
  findAll,
  findAllByUser,
  findAllByUserV2,
  findLastByUser,
  findAllByIds,
  findAllNotByUser,
  findById,
  create,
  update,
  delete: del,
  addUserProfileToJourney,
  addUserProfileToJourneys,
  findCountByUser,
  findDraftCountByUser,
  journeyToFeedJourneyDTO,
  enrichJourneys,
  enrichJourneysV2,
  validateJourney,
  publish,
  unpublish,
};
