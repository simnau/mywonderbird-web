const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const likeRouter = Router();

likeRouter.get(
  '/gem-captures/:gemCaptureId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { gemCaptureId },
    } = req;

    const likes = await service.findByGemCaptureId(gemCaptureId);

    return res.send({ likes });
  }),
);

likeRouter.post(
  '/gem-captures',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body: { gemCaptureId },
      user: { id: userId },
    } = req;

    const result = await service.createGemCaptureLike({
      userId,
      gemCaptureId,
    });

    res.send(result);
  }),
);

likeRouter.delete(
  '/gem-captures/:gemCaptureId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { gemCaptureId },
      user: { id: userId },
    } = req;

    const like = await service.findyByUserIdAndGemCaptureId(
      userId,
      gemCaptureId,
    );

    if (!like) {
      return res.send({ message: 'Gem Capture unliked' });
    } else if (like.userId !== userId) {
      const error = new Error('The user is not authorized to do this action');
      error.status = 403;

      throw error;
    }

    await service.deleteByUserIdAndGemCaptureId(userId, gemCaptureId);

    return res.send({ message: 'Gem Capture unliked' });
  }),
);

module.exports = likeRouter;
