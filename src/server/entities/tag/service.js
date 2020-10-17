const { Tag } = require('../../orm/models/tag');

async function findAll() {
  return Tag.findAll();
}

module.exports = {
  findAll,
};
