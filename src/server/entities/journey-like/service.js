const { Op } = require('sequelize');

const { unique } = require('../../util/array');
const { JourneyLike } = require('../../orm/models/journey-like');
const profileService = require('../profile/service');

function create(journeyLike) {
  return JourneyLike.create(journeyLike);
}

function findByUserIdAndJourneyId(userId, journeyId) {
  return JourneyLike.findOne({
    where: {
      userId,
      journeyId,
    },
  });
}

function findByJourneyId(journeyId) {
  return JourneyLike.findAll({
    where: { journeyId },
    order: [['updatedAt', 'DESC']],
  });
}

function deleteByUserIdAndJourneyId(userId, journeyId) {
  return JourneyLike.destroy({
    where: {
      userId,
      journeyId,
    },
    limit: 1,
  });
}

function countByJourneyId(journeyId) {
  return JourneyLike.count({
    where: {
      journeyId,
    },
  });
}

function findByJourneyIdsAndUserId(journeyIds, userId) {
  return JourneyLike.findAll({
    where: {
      journeyId: {
        [Op.in]: journeyIds,
      },
      userId,
    },
  });
}

async function addUserProfileToJourneyLikes(journeyLikes) {
  const uniqueUserIds = unique(
    journeyLikes.map(journeyLike => journeyLike.userId),
  );
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

  return journeyLikes.map(journeyLike => {
    const journeyLikeData = journeyLike.toJSON
      ? journeyLike.toJSON()
      : journeyLike;
    const profile = profilesById[journeyLikeData.userId] || {};
    return {
      ...journeyLikeData,
      userProfile: profile,
    };
  });
}

module.exports = {
  create,
  findByUserIdAndJourneyId,
  findByJourneyId,
  findByJourneyIdsAndUserId,
  deleteByUserIdAndJourneyId,
  countByJourneyId,
  addUserProfileToJourneyLikes,
};
