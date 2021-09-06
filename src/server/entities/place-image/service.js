const { Op } = require('sequelize');

const { PlaceImage } = require('../../orm/models/place-image');
const { deleteFile } = require('../../util/s3');
const { imagePathToImageUrl } = require('../../util/file-upload');

function fromGemCapture(gemCapture, userId, placeId = null) {
  return {
    title: gemCapture.title,
    url: gemCapture.url,
    imagePath: gemCapture.imagePath,
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

async function updateAll(
  placeId,
  updateImages,
  existingImages,
  { transaction },
) {
  const placesToDelete = existingImages.filter(existingImage =>
    updateImages.every(updateImage => updateImage.id !== existingImage.id),
  );

  for (const placeToDelete of placesToDelete) {
    const filename = placeToDelete.imagePath
      ? placeToDelete.imagePath
      : placeToDelete.url.substring(placeToDelete.url.lastIndexOf('/') + 1);

    await deleteFile(filename);
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

function toDTO(placeImage) {
  const rawPlaceImage = placeImage.toJSON ? placeImage.toJSON() : placeImage;

  return {
    ...rawPlaceImage,
    url: rawPlaceImage.imagePath
      ? imagePathToImageUrl(rawPlaceImage.imagePath)
      : rawPlaceImage.url,
  };
}

module.exports = {
  bulkCreate,
  fromGemCapture,
  createForPlace,
  updateAll,
  toDTO,
};
