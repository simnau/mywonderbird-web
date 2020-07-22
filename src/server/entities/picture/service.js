const fileUploader = require('../../util/file-upload');
const gemService = require('../gem/service');
const placeService = require('../place/service');
const sequelize = require('../../setup/sequelize');

async function sharePicture(
  { title, imageUrl, location, creationDate },
  journeyId,
  userId,
) {
  const lastGem = await gemService.findLastForJourney(journeyId);

  const sequenceNumber = lastGem ? lastGem.sequenceNumber + 1 : 0;

  const gem = {
    title,
    lat: location.lat,
    lng: location.lng,
    sequenceNumber,
    journeyId,
    createdAt: creationDate,
    updatedAt: creationDate,
    gemCaptures: [
      {
        title,
        url: imageUrl,
        sequenceNumber: 0,
      },
    ],
  };

  const transaction = await sequelize.transaction();

  try {
    const createdGem = await gemService.create(gem, transaction);
    await placeService.createFromGem(
      createdGem.toJSON(),
      location,
      userId,
      transaction,
    );

    await transaction.commit();
    return createdGem;
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
}

async function uploadFiles(files, folder) {
  const { images } = await fileUploader(files, folder);

  return {
    images,
  };
}

module.exports = {
  sharePicture,
  uploadFiles,
};
