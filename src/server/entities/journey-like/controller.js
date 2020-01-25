const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const { ADMIN_ROLE } = require('../../constants/roles');
const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const journeyLikeRouter = Router();

journeyLikeRouter.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body: { journeyId },
      user: { id: userId },
    } = req;

    const result = await service.create({
      userId,
      journeyId,
    });

    res.send(result);
  }),
);

journeyLikeRouter.delete(
  '/:journeyId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { journeyId },
      user: { id: userId, role },
    } = req;

    const journeyLike = await service.findByUserIdAndJourneyId(
      userId,
      journeyId,
    );

    if (!journeyLike) {
      return res.send({ message: 'Journey unliked' });
    } else if (journeyLike.userId !== userId && role !== ADMIN_ROLE) {
      const error = new Error('User is not authorized to do this action');
      error.status = 403;

      throw error;
    }

    await service.deleteByUserIdAndJourneyId(userId, journeyId);

    return res.send({ message: 'Journey unliked' });
  }),
);

journeyLikeRouter.get(
  '/:journeyId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { journeyId },
    } = req;

    const journeyLikes = await service.findByJourneyId(journeyId);
    const journeyLikesWithProfiles = await service.addUserProfileToJourneyLikes(
      journeyLikes,
    );

    return res.send({ journeyLikes: journeyLikesWithProfiles });
  }),
);

module.exports = journeyLikeRouter;
