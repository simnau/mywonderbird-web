const { Op } = require('sequelize');

const { Tag } = require('../../orm/models/tag');

async function findAll() {
  return Tag.findAll();
}

async function findByIds(ids) {
  return Tag.findAll({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });
}

async function findByCodes(codes) {
  return Tag.findAll({
    where: {
      code: {
        [Op.in]: codes,
      },
    },
  });
}

async function findById(id) {
  return Tag.findByPk(id);
}

module.exports = {
  findAll,
  findByIds,
  findByCodes,
  findById,
};
