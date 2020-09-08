const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const suggestionRouter = Router();

suggestionRouter.get(
  '/:bookmarkGroupId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { bookmarkGroupId },
      user: { id },
    } = req;

    const suggestedJourney = await service.suggestJourney(
      id,
      bookmarkGroupId === 'null' ? null : bookmarkGroupId,
    );

    res.send({ journey: suggestedJourney });
  }),
);

module.exports = suggestionRouter;
