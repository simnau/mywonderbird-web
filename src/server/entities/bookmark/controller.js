const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const bookmarkRouter = Router();

bookmarkRouter.get(
  '/gem-captures',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      query: { page, pageSize, bookmarkGroupId },
      user: { id: userId },
    } = req;

    const bookmarks = await service.findGemCaptureBookmarks(
      userId,
      bookmarkGroupId,
      page,
      pageSize,
    );

    res.send({ bookmarks });
  }),
);

bookmarkRouter.post(
  '/gem-captures',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body: { gemCaptureId, bookmarkGroupId },
      user: { id: userId },
    } = req;

    const result = await service.createGemCaptureBookmark({
      userId,
      gemCaptureId,
      bookmarkGroupId,
    });

    res.send(result);
  }),
);

bookmarkRouter.delete(
  '/gem-captures/:gemCaptureId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { gemCaptureId },
      user: { id: userId },
    } = req;

    const bookmark = await service.findyByUserIdAndGemCaptureId(
      userId,
      gemCaptureId,
    );

    if (!bookmark) {
      return res.send({ message: 'Gem Capture unbookmarked' });
    } else if (bookmark.userId !== userId) {
      const error = new Error('The user is not authorized to do this action');
      error.status = 403;

      throw error;
    }

    await service.deleteByUserIdAndGemCaptureId(userId, gemCaptureId);

    return res.send({ message: 'Gem Capture unbookmarked' });
  }),
);

module.exports = bookmarkRouter;
