const { PLACE_IMAGE_DIRECTORY } = require('../constants/files');

function getPlaceImagesDirectory(placeId) {
  return `${PLACE_IMAGE_DIRECTORY}/${placeId}`;
}

function getPlaceImagePath(placeId, filename) {
  return `${PLACE_IMAGE_DIRECTORY}/${placeId}/${filename}`;
}

module.exports = {
  getPlaceImagesDirectory,
  getPlaceImagePath,
};
