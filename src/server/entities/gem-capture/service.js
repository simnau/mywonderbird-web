const fileUploader = require('../../util/file-upload');

async function uploadFile(files) {
  const { latLng, images } = await fileUploader(files);

  return {
    latLng,
    images,
  };
}

module.exports = {
  uploadFile,
};
