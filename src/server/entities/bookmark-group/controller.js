const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const bookmarkGroupRouter = Router();

bookmarkGroupRouter.get(
  '/gem-captures',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id: userId },
    } = req;

    const bookmarkGroups = await service.findGemCaptureBookmarkGroups(userId);

    res.send({ bookmarkGroups });
  }),
);

bookmarkGroupRouter.post(
  '/gem-captures',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body: { title },
      user: { id: userId },
    } = req;

    const result = await service.createGemCaptureBookmarkGroup({
      userId,
      title,
    });

    res.send(result);
  }),
);

bookmarkGroupRouter.delete(
  '/gem-captures/:bookmarkGroupId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { bookmarkGroupId },
      user: { id: userId },
    } = req;

    const bookmarkGroup = await service.findyById(bookmarkGroupId);

    if (!bookmarkGroup) {
      return res.send({ message: 'Bookmark group deleted' });
    } else if (bookmarkGroup.userId !== userId) {
      const error = new Error('The user is not authorized to do this action');
      error.status = 403;

      throw error;
    }

    await service.deleteById(bookmarkGroupId);

    return res.send({ message: 'Bookmark group deleted' });
  }),
);

module.exports = bookmarkGroupRouter;
