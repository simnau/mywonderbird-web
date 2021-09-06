const config = require('config');

const s3FileUploader = require('./s3-file-upload');

const fileUploaderType = config.get('media.uploader');
const imageHostname = config.get('media.hostname');

const fileUploaderMapping = {
  s3: s3FileUploader,
};

async function uploadFile(files, folder, useOriginalFilename = false) {
  const fileUploader = fileUploaderMapping[fileUploaderType];

  if (!fileUploader) {
    throw new Error(`Unknown file uploader with type ${fileUploaderType}`);
  }

  const { images } = await fileUploader.uploadFiles(
    files,
    folder,
    useOriginalFilename,
  );

  const parsedImages = images.map(image => {
    if (!image) {
      return image;
    }

    const imageUrl = new URL(image);

    return {
      originalUrl: image,
      hostname: imageUrl.hostname,
      pathname: imageUrl.pathname.substring(1),
    };
  });

  return { images, parsedImages };
}

async function uploadFileArray(files, folder) {
  const fileUploader = fileUploaderMapping[fileUploaderType];

  if (!fileUploader) {
    throw new Error(`Unknown file uploader with type ${fileUploaderType}`);
  }

  return fileUploader.uploadFileArray(files, folder);
}

function imagePathToImageUrl(path) {
  return `https://${imageHostname}/${path}`;
}

module.exports = {
  uploadFile,
  uploadFileArray,
  imagePathToImageUrl,
};
