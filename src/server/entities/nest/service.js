const { Nest } = require('../../orm/models/nest');

function updateDayNest(existingNest, nestUpdate, dayId, transaction) {
  if (!existingNest && !nestUpdate) {
    return;
  }

  if (existingNest && !nestUpdate) {
    return Nest.destroy({ where: { id: existingNest.id }, transaction });
  } else if (!nestUpdate.id) {
    return Nest.create({ ...nestUpdate, dayId }, { transaction });
  } else {
    return Nest.update(nestUpdate, {
      where: { id: nestUpdate.id },
      transaction,
    });
  }
}

module.exports = {
  updateDayNest,
};
