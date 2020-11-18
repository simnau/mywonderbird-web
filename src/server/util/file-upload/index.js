const config = require('config');

const s3FileUploader = require('./s3-file-upload');

const fileUploaderType = config.get('media.uploader');

const fileUploaderMapping = {
  s3: s3FileUploader,
};

async function uploadFile(files, folder, useOriginalFilename = false) {
  const fileUploader = fileUploaderMapping[fileUploaderType];

  if (!fileUploader) {
    throw new Error(`Unknown file uploader with type ${fileUploaderType}`);
  }

  return fileUploader.uploadFiles(files, folder, useOriginalFilename);
}

async function uploadFileArray(files, folder) {
  const fileUploader = fileUploaderMapping[fileUploaderType];

  if (!fileUploader) {
    throw new Error(`Unknown file uploader with type ${fileUploaderType}`);
  }

  return fileUploader.uploadFileArray(files, folder);
}

module.exports = {
  uploadFile,
  uploadFileArray,
};
