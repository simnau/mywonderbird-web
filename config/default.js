module.exports = {
  database: {
    url: '',
  },
  server: {
    port: 8080,
  },
  media: {
    maxImageSize: 1080,
    fileUpload: {
      maxSize: 5 * 1024 * 1024,
    },
    uploader: 's3',
  },
  aws: {
    accessKey: '',
    secretKey: '',
    s3: {
      bucketName: '',
    },
  },
};
