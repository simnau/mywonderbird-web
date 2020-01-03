const { Op } = require('sequelize');

const { FavoriteJourney } = require('../../orm/models/favorite-journey');

function create(favoriteData) {
  return FavoriteJourney.create(favoriteData);
}

function findByUserId(userId) {
  return FavoriteJourney.findAll({
    where: {
      userId,
    },
    order: [['createdAt', 'DESC']],
  });
}

function countByUserId(userId) {
  return FavoriteJourney.count({
    where: {
      userId,
    },
  });
}

function deleteByUserIdAndJourneyId(userId, journeyId) {
  return FavoriteJourney.destroy({
    where: {
      userId,
      journeyId,
    },
    limit: 1,
  });
}

function findByJourneyIdsAndUserId(journeyIds, userId) {
  return FavoriteJourney.findAll({
    where: {
      journeyId: {
        [Op.in]: journeyIds,
      },
      userId,
    },
  });
}

module.exports = {
  create,
  findByUserId,
  countByUserId,
  deleteByUserIdAndJourneyId,
  findByJourneyIdsAndUserId,
};
