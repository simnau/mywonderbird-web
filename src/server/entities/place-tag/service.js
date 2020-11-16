const { Op } = require('sequelize');

const { PlaceTag } = require('../../orm/models/place-tag');

async function updateAll(placeId, updateTags, existingTags, { transaction }) {
  const tagsToDelete = existingTags.filter(existingTag =>
    updateTags.every(updateTag => updateTag.tagId !== existingTag.tagId),
  );
  const tagsToCreate = updateTags.filter(updateTag =>
    existingTags.every(existingTag => updateTag.tagId !== existingTag.tagId),
  );

  await PlaceTag.destroy({
    where: {
      id: {
        [Op.in]: tagsToDelete.map(tagToDelete => tagToDelete.id),
      },
    },
    transaction,
  });
  await PlaceTag.bulkCreate(
    tagsToCreate.map(tagToCreate => ({
      ...tagToCreate,
      placeId,
    })),
  );
}

module.exports = {
  updateAll,
};
