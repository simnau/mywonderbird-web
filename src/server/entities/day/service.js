const { Op } = require('sequelize');

const { Gem } = require('../../orm/models/gem');
const { GemCapture } = require('../../orm/models/gem-capture');
const { Nest } = require('../../orm/models/nest');
const { Day } = require('../../orm/models/day');
const gemService = require('../gem/service');
const nestService = require('../nest/service');

const INCLUDE_MODELS = [
  {
    model: Gem,
    as: 'gems',
    include: [
      {
        model: GemCapture,
        as: 'gemCaptures',
      },
    ],
  },
  {
    model: Nest,
    as: 'nest',
  },
];

async function updateGems(existingDaysById, dayUpdates = [], transaction) {
  return Promise.all(
    dayUpdates.map(dayUpdate => {
      const existingDay = existingDaysById[dayUpdate.id];

      return gemService.updateDayGems(
        existingDay.gems,
        dayUpdate.gems,
        dayUpdate.id,
        transaction,
      );
    }),
  );
}

async function updateNests(existingDaysById, dayUpdates, transaction) {
  return Promise.all(
    dayUpdates.map(dayUpdate => {
      const existingDay = existingDaysById[dayUpdate.id];

      return nestService.updateDayNest(
        existingDay.nest,
        dayUpdate.nest,
        dayUpdate.id,
        transaction,
      );
    }),
  );
}

function deleteByIds(ids, transaction) {
  return Day.destroy({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
    transaction,
  });
}

function bulkCreate(days, transaction) {
  return Day.bulkCreate(days, { include: INCLUDE_MODELS, transaction });
}

function update(days, transaction) {
  return Promise.all(
    days.map(async day =>
      Day.update(day, { where: { id: day.id }, transaction }),
    ),
  );
}

async function updateDays(existingDays, dayUpdates = [], journeyId, transaction) {
  const daysToDeleteIds = existingDays
    .filter(existingDay => {
      return !dayUpdates.find(dayUpdate => dayUpdate.id === existingDay.id);
    })
    .map(dayToDelete => dayToDelete.id);
  const daysToCreate = dayUpdates
    .filter(
      dayUpdate =>
        !existingDays.find(existingDay => existingDay.id === dayUpdate.id),
    )
    .map(dayUpdate => ({ ...dayUpdate, journeyId }));
  const daysToUpdate = dayUpdates.filter(
    dayUpdate =>
      !!existingDays.find(existingDay => existingDay.id === dayUpdate.id),
  );
  const existingDaysById = existingDays.reduce(
    (acc, existingDay) => ({ ...acc, [existingDay.id]: existingDay }),
    {},
  );

  await Promise.all([
    updateGems(existingDaysById, daysToUpdate, transaction),
    updateNests(existingDaysById, daysToUpdate, transaction),
    deleteByIds(daysToDeleteIds, transaction),
    bulkCreate(daysToCreate, transaction),
    update(daysToUpdate, transaction),
  ]);
}

module.exports = {
  updateDays,
};
