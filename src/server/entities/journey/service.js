const sequelize = require('../../setup/sequelize');
const { Journey } = require('../../orm/models/journey');
const { Day } = require('../../orm/models/day');
const { Gem } = require('../../orm/models/gem');
const { GemCapture } = require('../../orm/models/gem-capture');
const { Nest } = require('../../orm/models/nest');
const dayService = require('../day/service');
const { deleteFolder } = require('../../util/s3');

const INCLUDE_MODELS = [
  {
    model: Day,
    as: 'days',
    include: [
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
    ],
  },
];

function findAll() {
  return Journey.findAll({});
}

function findAllByUser(userId) {
  return Journey.findAll({
    where: {
      userId,
    },
  });
}

function findById(id) {
  return Journey.findByPk(id, {
    include: INCLUDE_MODELS,
    order: [
      [{ model: Day, as: 'days' }, 'dayNumber', 'ASC'],
      [
        { model: Day, as: 'days' },
        { model: Gem, as: 'gems' },
        'sequenceNumber',
        'ASC',
      ],
      [
        { model: Day, as: 'days' },
        { model: Gem, as: 'gems' },
        { model: GemCapture, as: 'gemCaptures' },
        'sequenceNumber',
        'ASC',
      ],
    ],
  });
}

function create(journey) {
  return sequelize.transaction(transaction => {
    return Journey.create(journey, {
      include: INCLUDE_MODELS,
      transaction,
    });
  });
}

async function update(id, journeyUpdate, existingJourney) {
  return sequelize.transaction(async transaction => {
    await dayService.updateDays(
      existingJourney.days,
      journeyUpdate.days,
      id,
      transaction,
    );
    await existingJourney.update(journeyUpdate, { transaction });
  });
}

async function del(id) {
  return sequelize.transaction(async transaction => {
    return Promise.all([
      Journey.destroy({
        where: { id },
        transaction,
      }),
      deleteFolder(id),
    ]);
  });
}

module.exports = {
  findAll,
  findAllByUser,
  findById,
  create,
  update,
  delete: del,
};
