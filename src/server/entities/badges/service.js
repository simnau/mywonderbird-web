const {
  BadgeConfiguration,
  CONTENT_CREATOR_TYPE,
} = require('../../orm/models/badge-configuration');
const { groupBy } = require('../../util/array');
const userStatisticsService = require('../user-statistics/service');

const BADGE_TYPES = [CONTENT_CREATOR_TYPE];

const BADGE_TYPE_TO_NAME = {
  [CONTENT_CREATOR_TYPE]: 'Content creator',
};

function resolveBadge(count, levelConfigurations, type) {
  if (!levelConfigurations.length) {
    return null;
  }

  let currentLevelIndex = -1;

  for (let i = 0; i < levelConfigurations.length; i++) {
    const levelConfig = levelConfigurations[i];

    if (levelConfig.count <= count) {
      currentLevelIndex = i;
    }
  }

  if (currentLevelIndex === -1) {
    const [firstConfig] = levelConfigurations;

    return {
      name: BADGE_TYPE_TO_NAME[type],
      type,
      description: firstConfig.description,
      level: 0,
      countToNextLevel: firstConfig.count,
      currentCount: count,
      badgeLevels: levelConfigurations.length,
    };
  }

  const currentLevelConfig = levelConfigurations[currentLevelIndex];
  const nextLevelConfig =
    levelConfigurations.length > currentLevelIndex + 1
      ? levelConfigurations[currentLevelIndex + 1]
      : null;

  return {
    name: BADGE_TYPE_TO_NAME[type],
    type,
    description: nextLevelConfig
      ? nextLevelConfig.description
      : currentLevelConfig.achievedDescription,
    level: currentLevelConfig.level,
    countToNextLevel: nextLevelConfig ? nextLevelConfig.count : null,
    currentCount: count,
    badgeLevels: levelConfigurations.length,
  };
}

async function findBadges({ userId }) {
  const badgeConfigurations = await BadgeConfiguration.findAll({
    order: [['type', 'ASC'], ['level', 'ASC']],
    raw: true,
  });

  const groupedConfigurations = groupBy(badgeConfigurations, item => item.type);
  const userStatistics = (await userStatisticsService.findByUserId(
    { userId },
    { raw: true },
  )) || {
    sharedPhotos: 0,
  };

  const badges = Object.entries(groupedConfigurations)
    .map(([type, typeConfigurations]) => {
      if (!BADGE_TYPES.includes(type)) {
        return null;
      }

      return resolveBadge(
        userStatistics.sharedPhotos,
        typeConfigurations,
        type,
      );
    })
    .filter(value => !!value);

  return badges;
}

module.exports = {
  findBadges,
};
