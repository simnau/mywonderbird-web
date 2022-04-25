const { Op } = require('sequelize');

const {
  Notification,
  NOTIFICATION_TYPE_LIKE,
  GEM_ENTITY_TYPE,
} = require('../../orm/models/notification');
const gemCaptureService = require('../gem-capture/service');
const profileService = require('../profile/service');
const pushNotificationService = require('../push-notifications/service');
const { unique, indexBy } = require('../../util/array');

async function createGemCaptureLikeNotification({
  relatedUserId,
  gemCaptureId,
}) {
  const gemCapture = await gemCaptureService.findById(gemCaptureId, {
    includeModels: true,
  });

  let userId = gemCapture.gem.userId;

  if (!userId && gemCapture.gem.journey) {
    userId = gemCapture.gem.journey.userId;
  }

  if (userId === relatedUserId) {
    // We don't want to create notifications if the user liked their own GemCapture
    return null;
  }

  const existingNotification = await Notification.scope('like').findOne({
    where: {
      userId,
      relatedUserId,
      entityType: GEM_ENTITY_TYPE,
      // using the gem ID as we want the notifications to appear for gems even if a gem capture was liked
      entityId: gemCapture.gem.id,
    },
  });

  if (existingNotification) {
    return existingNotification;
  }

  await pushNotificationService.sendPushNotification({
    userId,
    notificationType: pushNotificationService.NOTIFICATION_TYPES.like,
  });

  return Notification.create({
    userId,
    relatedUserId,
    entityType: GEM_ENTITY_TYPE,
    entityId: gemCapture.gem.id,
    type: NOTIFICATION_TYPE_LIKE,
  });
}

async function findAll({ userId, lastDatetime, limit }) {
  const where = {};

  if (userId) {
    where.userId = userId;
  }

  if (lastDatetime) {
    where.updatedAt = {
      [Op.lt]: lastDatetime,
    };
  }

  return Notification.findAll({
    where,
    order: [['updatedAt', 'DESC']],
    limit,
  });
}

async function findById(id) {
  return Notification.findByPk(id);
}

async function markAsRead(id) {
  return Notification.update(
    {
      read: true,
    },
    {
      where: {
        id,
      },
    },
  );
}

async function markAllAsRead(userId) {
  return Notification.update(
    {
      read: true,
    },
    {
      where: {
        userId,
      },
    },
  );
}

async function toDTOs(notifications) {
  if (!notifications || !notifications.length) {
    return notifications;
  }

  const relatedUserIds = unique(
    notifications.map(({ relatedUserId }) => relatedUserId),
  );

  const userProfiles = await profileService.findProfilesByProviderIds(
    relatedUserIds,
  );
  const userProfilesByProviderId = indexBy(userProfiles, 'providerId');

  return notifications.map(notification => {
    const userProfile = userProfilesByProviderId[notification.relatedUserId];

    return {
      ...(notification.toJSON ? notification.toJSON() : notification),
      relatedUserProfile: userProfile,
    };
  });
}

async function findUnreadCount({ userId }) {
  const where = {
    read: false,
  };

  if (userId) {
    where.userId = userId;
  }

  return Notification.count({
    where,
  });
}

module.exports = {
  createGemCaptureLikeNotification,
  findAll,
  findById,
  markAsRead,
  markAllAsRead,
  findUnreadCount,
  toDTOs,
};
