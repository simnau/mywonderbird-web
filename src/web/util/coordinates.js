import exif from 'exif-js';

export function convertDMSToDD(degrees, minutes, seconds, direction) {
  let dd = degrees + minutes / 60 + seconds / 3600;

  if (direction == 'S' || direction == 'W') {
    dd = dd * -1;
  }

  return dd;
}

export async function getCoordinatesFromImage(imageFileBlob) {
  const exifData = exif.readFromBinaryFile(imageFileBlob);

  if (!exifData) {
    return null;
  }

  const [latDegrees, latMinutes, latSeconds] = exifData.GPSLatitude;
  const latDirection = exifData.GPSLatitudeRef;

  const [lngDegrees, lngMinutes, lngSeconds] = exifData.GPSLongitude;
  const lngDirection = exifData.GPSLongitudeRef;

  const lat = convertDMSToDD(latDegrees, latMinutes, latSeconds, latDirection);
  const lng = convertDMSToDD(lngDegrees, lngMinutes, lngSeconds, lngDirection);

  return { lat, lng };
}
