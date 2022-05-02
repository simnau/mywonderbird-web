require('dotenv').config();
const sequelize = require('../setup/sequelize');
const logger = require('../util/logger');

const gemService = require('../entities/gem/service');
const { UserStatistic } = require('../orm/models/user-statistic');

const BATCH_SIZE = 50;

function splitIntoBatches(array) {
  const result = [];

  for (let i = Math.ceil(array.length / BATCH_SIZE); i > 0; i--) {
    result.push(array.splice(0, Math.ceil(array.length / i)));
  }

  return result;
}

async function run() {
  const gems = await gemService.findAllWithJourneys();

  const statsByUserId = {};

  gems.forEach(gem => {
    let userId = gem.userId;

    if (!userId && gem.journey) {
      userId = gem.journey.userId;
    }

    const userStats = statsByUserId[userId] || {
      sharedPhotos: 0,
    };

    const photoCount = gem.gemCaptures.length;

    statsByUserId[userId] = {
      ...userStats,
      sharedPhotos: userStats.sharedPhotos + photoCount,
    };
  });

  logger.info(`Updating stats for ${Object.keys(statsByUserId).length} users`);

  const userIdBatches = splitIntoBatches(Object.keys(statsByUserId));
  const statBatches = userIdBatches.map(batch => {
    return batch.map(userId => {
      const stats = statsByUserId[userId];

      return {
        userId,
        ...stats,
      };
    });
  });

  logger.info(`Updating stats in ${statBatches.length} batches`);

  const t = await sequelize.transaction();

  try {
    await UserStatistic.destroy(
      { where: {} },
      {
        transaction: t,
      },
    );

    for (const batch of statBatches) {
      await UserStatistic.bulkCreate(batch, { transaction: t });
    }

    await t.commit();
    logger.info('Finished updating stats');
  } catch (e) {
    logger.error(
      `An error has occurred while calculating user stats ${e.message}`,
    );
    await t.rollback();
    throw e;
  }
}

module.exports = {
  run,
};
