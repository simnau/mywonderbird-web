const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const service = require('./service');
const journeyService = require('../journey/service');
const requireAuth = require('../../middleware/require-auth');
const { ADMIN_ROLE } = require('../../constants/roles');

const journeyCommentRouter = Router();
const DEFAULT_PAGE_SIZE = 20;

journeyCommentRouter.get(
  '/:journeyId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { journeyId },
      query: { page = 1, pageSize = DEFAULT_PAGE_SIZE },
    } = req;

    const { comments, total } = await service.findByJourneyId(journeyId, {
      page,
      pageSize,
    });
    const commentsWithProfiles = await service.addUserProfilesToComments(
      comments,
    );

    res.send({ comments: commentsWithProfiles, total });
  }),
);

journeyCommentRouter.post(
  '/:journeyId',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { journeyId },
      user: { id },
      body: { comment },
    } = req;

    const journey = await journeyService.findById(journeyId);

    if (!journey) {
      const error = new Error(
        `The journey with id ${journeyId} does not exist`,
      );
      error.status = 404;

      throw error;
    }

    const createdComment = await service.create({
      userId: id,
      journeyId,
      comment,
    });
    const commentWithUserProfile = await service.addUserProfileToComment(
      createdComment,
    );

    res.send(commentWithUserProfile);
  }),
);

journeyCommentRouter.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { id },
      user: { id: userId, role },
    } = req;

    const comment = await service.findById(id);

    if (!comment) {
      return res.send({ message: 'Comment successfully deleted' });
    } else if (comment.userId !== userId && role !== ADMIN_ROLE) {
      const error = new Error('User is not authorized to do this action');
      error.status = 403;

      throw error;
    }

    await service.deleteById(id);
    return res.send({ message: 'Comment successfully deleted' });
  }),
);

module.exports = journeyCommentRouter;
