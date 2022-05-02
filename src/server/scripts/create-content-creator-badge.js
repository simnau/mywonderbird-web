require('dotenv').config();
require('../setup/sequelize');

const {
  BadgeConfiguration,
  CONTENT_CREATOR_TYPE,
} = require('../orm/models/badge-configuration');

async function run() {
  await BadgeConfiguration.bulkCreate([
    {
      type: CONTENT_CREATOR_TYPE,
      level: 1,
      description: 'Share 1 photo',
      achievedDescription: 'You shared 1 photo',
      count: 1,
    },
    {
      type: CONTENT_CREATOR_TYPE,
      level: 2,
      description: 'Share 10 photos',
      achievedDescription: 'You shared 10 photos',
      count: 10,
    },
    {
      type: CONTENT_CREATOR_TYPE,
      level: 3,
      description: 'Share 50 photos',
      achievedDescription: 'You shared 50 photos',
      count: 50,
    },
    {
      type: CONTENT_CREATOR_TYPE,
      level: 4,
      description: 'Share 100 photos',
      achievedDescription: 'You shared 100 photos',
      count: 100,
    },
    {
      type: CONTENT_CREATOR_TYPE,
      level: 5,
      description: 'Share 200 photos',
      achievedDescription: 'You shared 200 photos',
      count: 200,
    },
    {
      type: CONTENT_CREATOR_TYPE,
      level: 6,
      description: 'Share 400 photos',
      achievedDescription: 'You shared 400 photos',
      count: 400,
    },
  ]);
}

module.exports = {
  run,
};
