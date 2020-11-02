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

module.exports = {
  findAll,
  findByIds,
};
