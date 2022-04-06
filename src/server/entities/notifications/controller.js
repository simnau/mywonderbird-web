const { Router } = require('express');
const asyncHandler = require('express-async-handler');
const { DEFAULT_LIMIT } = require('../../constants/infinite-scroll');
const { ADMIN_ROLE } = require('../../constants/roles');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const notificationRouter = Router();

notificationRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      query: { lastDatetime, limit = DEFAULT_LIMIT },
      user: { id: userId },
    } = req;

    const notifications = await service.findAll({
      userId,
      lastDatetime,
      limit,
    });
    const notificationDTOs = await service.toDTOs(notifications);

    return res.send({ notifications: notificationDTOs });
  }),
);

notificationRouter.get(
  '/count',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id: userId },
    } = req;

    const notificationCount = await service.findUnreadCount({
      userId,
    });

    return res.send({
      notificationCount,
    });
  }),
);

notificationRouter.post(
  '/read/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      params: { id },
      user: { id: userId, role },
    } = req;

    const existingNotification = await service.findById(id);

    if (!existingNotification) {
      return res.send({
        message: `Notification with id ${id} marked as read`,
      });
    } else if (role !== ADMIN_ROLE && existingNotification.userId !== userId) {
      const error = new Error('User is not authorized to do this action');
      error.status = 403;

      throw error;
    }

    await service.markAsRead(id);

    res.send({
      message: `Notification with id ${id} marked as read`,
    });
  }),
);

notificationRouter.post(
  '/read',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      user: { id: userId },
    } = req;

    await service.markAllAsRead(userId);

    res.send({
      message: 'All user Notifications marked as read',
    });
  }),
);

module.exports = notificationRouter;
