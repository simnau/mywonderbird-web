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
    },
    cognito: {
      region: 'AWS_COGNITO_REGION',
      poolId: 'AWS_COGNITO_POOL_ID',
      clientId: 'AWS_COGNITO_CLIENT_ID',
      domain: 'AWS_COGNITO_DOMAIN',
    },
  },
  feed: {
    maxImageCount: 'FEED_MAX_IMAGE_COUNT',
  },
  mailerlite: {
    apiKey: 'MAILERLITE_API_KEY',
    webGroupId: 'MAILERLITE_WEB_GROUP_ID',
    newsletterGroupId: 'MAILERLITE_NEWSLETTER_GROUP_ID',
  },
  segment: {
    writeKey: 'SEGMENT_WRITE_KEY',
  },
  here: {
    maps: {
      appId: 'HERE_MAPS_APP_ID',
      apiKey: 'HERE_MAPS_API_KEY',
    },
  },
  location: {
    browse: {
      distanceThreshold: 'LOCATION_BROWSE_DISTANCE_THRESHOLD',
    },
    geohash: {
      precision: 'LOCATION_GEOHASH_PRECISION',
    },
  },
  sentry: {
    dsn: 'SENTRY_DSN',
  },
};
