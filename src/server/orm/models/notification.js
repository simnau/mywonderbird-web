const Sequelize = require('sequelize');

const sequelize = require('../../setup/sequelize');

const NOTIFICATION_TYPE_LIKE = 10;

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
};

const Notification = sequelize.define('notifications', FIELDS, {
  scopes: {
    like: {
      where: {
        type: NOTIFICATION_TYPE_LIKE,
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
  GEM_ENTITY_TYPE,
};
