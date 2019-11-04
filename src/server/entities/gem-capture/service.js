const { Op } = require('sequelize');
const uuidv4 = require('uuid/v4');

const fileUploader = require('../../util/file-upload');
const { GemCapture } = require('../../orm/models/gem-capture');

async function uploadFiles(files, folder) {
  const { latLng, images } = await fileUploader(files, folder);

  return {
    latLng,
    images,
  };
}

function deleteByIds(ids, transaction) {
  return GemCapture.destroy({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
    transaction,
  });
}

function bulkCreate(gemCaptures, transaction) {
  return GemCapture.bulkCreate(gemCaptures, { transaction });
}

function update(gemCaptures, transaction) {
  return Promise.all(
    gemCaptures.map(async gemCapture =>
      GemCapture.update(gemCapture, {
        where: { id: gemCapture.id },
        transaction,
      }),
    ),
  );
}

async function updateGemCaptures(
  existingGemCaptures,
  gemCaptureUpdates,
  gemId,
  transaction,
) {
  const gemCapturesToDeleteIds = existingGemCaptures
    .filter(existingGemCapture => {
      return !gemCaptureUpdates.find(
        gemCaptureUpdate => gemCaptureUpdate.id === existingGemCapture.id,
      );
    })
    .map(gemToDelete => gemToDelete.id);
  const gemCapturesToCreate = gemCaptureUpdates
    .filter(gemCaptureUpdate => !gemCaptureUpdate.id)
    .map(gemCaptureUpdate => ({ ...gemCaptureUpdate, id: uuidv4(), gemId }));
  const gemCapturesToUpdate = gemCaptureUpdates.filter(
    gemCaptureUpdate =>
      !!gemCaptureUpdate.id &&
      !!existingGemCaptures.find(
        existingGemCapture => existingGemCapture.id === gemCaptureUpdate.id,
      ),
  );

  await Promise.all([
    deleteByIds(gemCapturesToDeleteIds, transaction),
    bulkCreate(gemCapturesToCreate, transaction),
    update(gemCapturesToUpdate, transaction),
  ]);
}

module.exports = {
  uploadFiles,
  updateGemCaptures,
};
