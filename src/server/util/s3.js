const config = require('config');

const s3 = require('../setup/s3');

const {
  s3: { bucketName },
} = config.get('aws');

async function deleteFolder(folder) {
  const listParams = {
    Bucket: bucketName,
    Prefix: `${folder}/`,
  };

  const listedObjects = await s3.listObjectsV2(listParams).promise();

  if (listedObjects.Contents.length === 0) {
    return;
  }

  const objectsToDelete = listedObjects.Contents.map(({ Key }) => ({ Key }));

  const deleteParams = {
    Bucket: bucketName,
    Delete: { Objects: objectsToDelete },
  };

  await s3.deleteObjects(deleteParams).promise();

  if (listedObjects.IsTruncated) {
    await emptyS3Directory(bucket, dir);
  }

  return;
}

module.exports = {
  deleteFolder,
};
