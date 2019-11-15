const config = require('config');
const fileType = require('file-type');
const uuidv4 = require('uuid/v4');

const s3 = require('../../setup/s3');

const {
  s3: { bucketName },
} = config.get('aws');

async function uploadFiles(files, folder) {
  const images = [];

  for (const [, file] of Object.entries(files)) {
    const imageType = fileType(file.data);
    const filename = `${folder}/${uuidv4()}.${imageType.ext}`;

    const params = {
      Bucket: bucketName,
      Key: filename,
      Body: file.data,
      ContentType: imageType.mime,
    };

    const imageUploadData = await s3.upload(params).promise();

    images.push(imageUploadData.Location);
  }

  return {
    images,
  };
}

module.exports = uploadFiles;
