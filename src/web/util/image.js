import { dataURLToBlob, blobToArrayBuffer } from 'blob-util';

import { MAX_IMAGE_SIZE } from '../constants/image';
import { getCoordinatesFromImage } from './coordinates';

function getMaxWidth(maxSize, aspectRatio) {
  return aspectRatio > 1 ? maxSize : maxSize * aspectRatio;
}

function getMaxHeight(maxSize, aspectRatio) {
  return aspectRatio > 1 ? maxSize / aspectRatio : maxSize;
}

export function getResizedImage(
  imageData,
  imageName,
  maxSize = MAX_IMAGE_SIZE,
) {
  return new Promise(resolve => {
    const image = new Image();
    image.src = imageData;

    image.onload = () => {
      const aspectRatio = image.width / image.height;
      const maxWidth = getMaxWidth(maxSize, aspectRatio);
      const maxHeight = getMaxHeight(maxSize, aspectRatio);
      const resizedWidth = image.width < maxWidth ? image.width : maxWidth;
      const resizedHeight = image.height < maxHeight ? image.height : maxHeight;

      const canvas = document.createElement('canvas');
      canvas.width = resizedWidth;
      canvas.height = resizedHeight;

      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, resizedWidth, resizedHeight);
      context.canvas.toBlob(
        blob => {
          const resizedFile = new File([blob], imageName, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });

          resolve(resizedFile);
        },
        'image/jpeg',
        0.8,
      );
    };
  });
}

export function createResizedImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async event => {
      const imageData = event.target.result;
      const resizedImage = await getResizedImage(imageData, file.name);

      resolve(resizedImage);
    };
    reader.onerror = error => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}

export function getResizedImages(files) {
  return Promise.all(files.map(file => createResizedImage(file)));
}

export function getResizedImageAndCoordinates(file, currentCoordinates) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async event => {
      const imageData = event.target.result;
      const resizedImage = await getResizedImage(imageData, file.name);

      resolve({
        resizedImage,
        coordinates: currentCoordinates
          ? currentCoordinates
          : await getCoordinatesFromImage(
              await blobToArrayBuffer(dataURLToBlob(imageData)),
            ),
      });
    };
    reader.onerror = error => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}

export async function getResizedImagesAndCoordinates(files) {
  const resizedImages = [];
  let coordinates = null;

  for (const file of files) {
    const {
      resizedImage,
      coordinates: newCoordinates,
    } = await getResizedImageAndCoordinates(file, coordinates);

    resizedImages.push(resizedImage);
    coordinates = newCoordinates;
  }

  return {
    coordinates,
    resizedImages,
  };
}
