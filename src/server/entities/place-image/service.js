const { PlaceImage } = require('../../orm/models/place-image');

function fromGemCapture(gemCapture, userId, placeId = null) {
  return {
    title: gemCapture.title,
    url: gemCapture.url,
    userId,
    placeId,
    gemCaptureId: gemCapture.id,
  }
}

function bulkCreate(placeImages, transaction = null) {
  return PlaceImage.bulkCreate(placeImages, {
    transaction,
  });
}

module.exports = {
  bulkCreate,
  fromGemCapture,
};
