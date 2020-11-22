const { Op } = require('sequelize');

const { getPlaceImagePath } = require('../../util/file');
const { PlaceImage } = require('../../orm/models/place-image');
const { deleteFile } = require('../../util/s3');

function fromGemCapture(gemCapture, userId, placeId = null) {
  return {
    title: gemCapture.title,
    url: gemCapture.url,
    userId,
    placeId,
    gemCaptureId: gemCapture.id,
  };
}

async function createForPlace(placeId, images) {
  return PlaceImage.bulkCreate(
    images.map(image => ({
      ...image,
      placeId,
    })),
  );
}

async function updateAll(placeId, updateImages, existingImages, { transaction }) {
  const placesToDelete = existingImages.filter(existingImage =>
    updateImages.every(updateImage => updateImage.id !== existingImage.id),
  );

  for (const placeToDelete of placesToDelete) {
    const filename = placeToDelete.url.substring(placeToDelete.url.lastIndexOf('/') + 1);
    const s3Filename = getPlaceImagePath(placeId, filename);

    await deleteFile(s3Filename);
  }

  await PlaceImage.destroy({
    where: {
      id: {
        [Op.in]: placesToDelete.map(placeToDelete => placeToDelete.id),
      },
    },
    transaction,
  });
}

function bulkCreate(placeImages, transaction = null) {
  return PlaceImage.bulkCreate(placeImages, {
    transaction,
  });
}

module.exports = {
  bulkCreate,
  fromGemCapture,
  createForPlace,
  updateAll,
};
