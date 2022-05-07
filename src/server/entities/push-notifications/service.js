const firebase = require('firebase-admin');
const { NotificationToken } = require('../../orm/models/notification-token');

const NOTIFICATION_TYPES = {
  like: 'like',
  badgeReceived: 'badge-received',
};

const NOTIFICATION_CONTENTS = {
  [NOTIFICATION_TYPES.like]: {
    title: 'Someone likes a photo you shared ❤',
    link: 'com.mywonderbird://notifications',
    data: {
      type: NOTIFICATION_TYPES.like,
    },
  },
  [NOTIFICATION_TYPES.badgeReceived]: {
    title: 'You have received a new badge',
    link: 'com.mywonderbird://achievements',
    data: {
      type: NOTIFICATION_TYPES.badgeReceived,
    },
  },
};

async function saveToken({ userId, deviceToken }) {
  const existingToken = await NotificationToken.findOne({
    where: {
      deviceToken,
    },
  });

  if (existingToken) {
    return existingToken;
  }

  return NotificationToken.create({
    userId,
    deviceToken,
  });
}

async function removeToken({ userId, deviceToken }) {
  return NotificationToken.destroy({
    where: {
      userId,
      deviceToken,
    },
  });
}

async function getTokensByUserId({ userId }) {
  return NotificationToken.findAll({
    where: {
      userId,
    },
  });
}

async function sendPushNotification({
  userId,
  notificationType,
  extraData = {},
}) {
  const notificationContent = NOTIFICATION_CONTENTS[notificationType];

  if (!notificationContent) {
    return;
  }

  const { data, ...content } = notificationContent;

  const deviceTokens = (await getTokensByUserId({ userId })).map(
    record => record.deviceToken,
  );

  if (!deviceTokens.length) {
    return;
  }

  try {
    await Promise.all(
      deviceTokens.map(async deviceToken => {
        return firebase.messaging().sendToDevice(deviceToken, {
          notification: content,
          data: {
            ...extraData,
            ...data,
          },
        });
      }),
    );
  } catch (e) {
    console.log(e);
    // handle error
  }
}

module.exports = {
  sendPushNotification,
  saveToken,
  removeToken,
  NOTIFICATION_TYPES,
};
