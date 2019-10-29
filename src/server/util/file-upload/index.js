const config = require('config');

const s3FileUploader = require('./s3-file-upload'); 

const fileUploaderType = config.get('media.uploader');

const fileUploaderMapping = {
  's3': s3FileUploader,
};

async function uploadFile(files) {
  const fileUploader = fileUploaderMapping[fileUploaderType];

  if (!fileUploader) {
    throw new Error(`Unknown file uploader with type ${fileUploaderType}`);
  }

  return fileUploader(files);
}

module.exports = uploadFile;
