const { Journey } = require('../../orm/models/journey');
const { Day } = require('../../orm/models/day');
const { Gem } = require('../../orm/models/gem');
const { GemCapture } = require('../../orm/models/gem-capture');
const { Nest } = require('../../orm/models/nest');

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
    ],
  });
}

function create(journey) {
  return Journey.create(journey, {
    include: INCLUDE_MODELS,
  });
}

async function update(id, journey) {
  const existingJourney = await findById(id);

  if (!existingJourney) {
    const error = new Error(`Journey with id ${id} does not exist`);
    error.status = 404;

    throw error;
  }

  return existingJourney.update(journey);
}

function del(id) {
  return Journey.destroy({
    where: { id },
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
