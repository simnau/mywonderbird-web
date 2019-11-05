const { CUSTOM_ATTRIBUTE_PREFIX } = require('../src/server/constants/cognito');

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
    cognito: {
      region: '',
      poolId: '',
      clientId: '',
      roleAttribute: `${CUSTOM_ATTRIBUTE_PREFIX}role`,
    },
  },
  auth: {
    header: 'Authorization',
  },
};
