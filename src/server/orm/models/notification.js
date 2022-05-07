const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');

const NOTIFICATION_TYPE_LIKE = 10;
const NOTIFICATION_TYPE_BADGE_RECEIVED = 20;

const GEM_ENTITY_TYPE = 1000;

const FIELDS = {
  id: {
    primaryKey: true,
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  type: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  relatedUserId: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  entityType: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  entityId: {
    type: Sequelize.UUID,
    allowNull: true,
  },
  read: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  extraData: {
    type: Sequelize.JSONB,
    allowNull: true,
  },
};

const Notification = sequelize.define('notifications', FIELDS, {
  scopes: {
    like: {
      where: {
        type: NOTIFICATION_TYPE_LIKE,
      },
    },
    badgeReceived: {
      where: {
        type: NOTIFICATION_TYPE_BADGE_RECEIVED,
      },
    },
    gem: {
      where: {
        entityType: GEM_ENTITY_TYPE,
      },
    },
  },
});

module.exports = {
  Notification,
  FIELDS,
  NOTIFICATION_TYPE_LIKE,
  NOTIFICATION_TYPE_BADGE_RECEIVED,
  GEM_ENTITY_TYPE,
};
