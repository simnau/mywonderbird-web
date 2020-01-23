const { JourneyComment } = require('../../orm/models/journey-comment');
const { unique } = require('../../util/array');

const DEFAULT_PAGE_SIZE = 20;
const profileService = require('../profile/service');

function create(comment) {
  return JourneyComment.create(comment);
}

async function findById(id) {
  return JourneyComment.findByPk(id);
}

async function findByJourneyId(
  journeyId,
  { page = 1, pageSize = DEFAULT_PAGE_SIZE },
) {
  const { rows: comments, count: total } = await JourneyComment.findAndCountAll(
    {
      where: {
        journeyId,
      },
      order: [['updatedAt', 'ASC']],
      offset: (page - 1) * pageSize,
      limit: pageSize,
    },
  );

  return {
    comments,
    total,
  };
}

async function deleteById(id) {
  return JourneyComment.destroy({ where: { id } });
}

async function countByJourneyId(journeyId) {
  return JourneyComment.count({ where: { journeyId } });
}

async function addUserProfilesToComments(comments) {
  const uniqueUserIds = unique(comments.map(comment => comment.userId));
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

  return comments.map(comment => {
    const commentData = comment.toJSON ? comment.toJSON() : comment;
    const profile = profilesById[commentData.userId] || {};
    return {
      ...commentData,
      userProfile: profile,
    };
  });
}

async function addUserProfileToComment(comment) {
  const commentData = comment.toJSON ? comment.toJSON() : comment;
  const userProfile = await profileService.findOrCreateProfileByProviderId(
    commentData.userId,
  );

  return {
    ...commentData,
    userProfile,
  };
}

module.exports = {
  create,
  findById,
  findByJourneyId,
  deleteById,
  countByJourneyId,
  addUserProfileToComment,
  addUserProfilesToComments,
};
