const AWS = require('aws-sdk');
const config = require('config');

const {
  accessKey,
  secretKey,
} = config.get('aws');
const s3 = new AWS.S3({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
});

module.exports = s3;
