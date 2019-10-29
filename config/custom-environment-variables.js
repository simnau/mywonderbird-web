module.exports = {
  database: {
    url: 'DATABASE_URL',
  },
  server: {
    port: 'PORT',
  },
  media: {
    maxImageSize: 'MEDIA_MAX_IMAGE_SIZE',
    fileUpload: {
      maxSize: 'MEDIA_FILE_UPLOAD_MAX_SIZE',
    },
    uploader: 'MEDIA_UPLOADER',
  },
  aws: {
    accessKey: 'AWS_ACCESS_KEY',
    secretKey: 'AWS_SECRET_KEY',
    s3: {
      bucketName: 'AWS_S3_BUCKET_NAME',
    }
  },
};
