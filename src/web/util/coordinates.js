import exif from 'exif-js';
import { getBoundingBox } from 'geolocation-utils';

export function convertDMSToDD(degrees, minutes, seconds, direction) {
  let dd = degrees + minutes / 60 + seconds / 3600;

  if (direction == 'S' || direction == 'W') {
    dd = dd * -1;
  }

  return dd;
}

export async function getCoordinatesFromImage(imageFileBlob) {
  const exifData = exif.readFromBinaryFile(imageFileBlob);

  if (!exifData || !exifData.GPSLatitude || !exifData.GPSLongitude) {
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

export function findDayCoordinateBoundingBox(days) {
  const coordinates = days.reduce((acc, day) => {
    return acc.concat(day.coordinates);
  }, []);

  const boundingBox = getBoundingBox(coordinates);

  if (!boundingBox.topLeft || !boundingBox.bottomRight) {
    return null;
  }

  return [boundingBox.topLeft, boundingBox.bottomRight];
}
