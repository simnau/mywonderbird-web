const {
  PLACE_IMAGE_DIRECTORY,
  TAG_IMAGE_DIRECTORY,
} = require('../constants/files');

function getPlaceImagesDirectory(placeId) {
  return `${PLACE_IMAGE_DIRECTORY}/${placeId}`;
}

function getPlaceImagePath(placeId, filename) {
  return `${PLACE_IMAGE_DIRECTORY}/${placeId}/${filename}`;
}

function getTagImagesDirectory() {
  return `${TAG_IMAGE_DIRECTORY}`;
}

function getTagImagePath(filename) {
  return `${TAG_IMAGE_DIRECTORY}/${filename}`;
}

module.exports = {
  getPlaceImagesDirectory,
  getPlaceImagePath,
  getTagImagesDirectory,
  getTagImagePath,
};
