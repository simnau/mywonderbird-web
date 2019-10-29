const exif = require('jpeg-exif');
const AWS = require('aws-sdk');
const config = require('config');
const fileType = require('file-type');
const uuidv4 = require('uuid/v4');
const moment = require('moment');

const {
  accessKey,
  secretKey,
  s3: { bucketName },
} = config.get('aws');

const s3 = new AWS.S3({
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
});

function dmsToDecimal(degrees, minutes, seconds) {
  return degrees + minutes / 60 + seconds / 3600;
}

function getLatLngFromExifData(data) {
  if (!data || !data.GPSInfo) {
    return null;
  }

  const {
    GPSInfo: {
      GPSLatitude: [latDegrees, latMinutes, latSeconds],
      GPSLongitude: [lngDegrees, lngMinutes, lngSeconds],
    },
  } = data;

  const lat = dmsToDecimal(latDegrees, latMinutes, latSeconds);
  const lng = dmsToDecimal(lngDegrees, lngMinutes, lngSeconds);

  return {
    lat,
    lng,
  };
}

async function uploadFiles(files) {
  const images = [];
  let latLng;

  for (const [, file] of Object.entries(files)) {
    const data = exif.fromBuffer(file.data);

    if (!latLng) {
      latLng = getLatLngFromExifData(data);
    }

    const imageType = fileType(file.data);
    const filename = `${moment().format('YYYY-MM-DD')}/${uuidv4()}.${
      imageType.ext
    }`;

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
    latLng,
    images,
  };
}

module.exports = uploadFiles;
