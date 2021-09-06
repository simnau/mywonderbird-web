const { Op } = require('sequelize');

const { Tag } = require('../../orm/models/tag');
const { getTagImagePath, getTagImagesDirectory } = require('../../util/file');
const { uploadFile, imagePathToImageUrl } = require('../../util/file-upload');
const { deleteFile } = require('../../util/s3');

async function findAll() {
  return Tag.findAll();
}

async function findByIds(ids) {
  return Tag.findAll({
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });
}

async function findByCodes(codes) {
  return Tag.findAll({
    where: {
      code: {
        [Op.in]: codes,
      },
    },
  });
}

async function findById(id) {
  return Tag.findByPk(id);
}

async function create(tag, { images }) {
  if (images) {
    const image = await uploadImage(images);

    return Tag.create({
      ...tag,
      imagePath: image.pathname,
    });
  }

  return Tag.create(tag);
}

async function update(id, tag, { images }) {
  const existingTag = await findById(id);

  if (!existingTag) {
    const error = new Error(`Tag with id ${id} not found`);
    error.code = 404;

    throw error;
  }

  if (
    images &&
    Object.keys(images).length &&
    (existingTag.imageUrl || existingTag.imagePath)
  ) {
    const imageFilename = existingTag.imagePath
      ? existingTag.imagePath
      : existingTag.imageUrl.substring(
          existingTag.imageUrl.lastIndexOf('/') + 1,
        );

    await deleteFile(imageFilename);
  }

  if (images) {
    const image = await uploadImage(images);

    return existingTag.update({
      ...tag,
      imagePath: image.pathname,
    });
  }

  return existingTag.update(tag);
}

async function deleteById(id) {
  const existingTag = await findById(id);

  if (!existingTag) {
    return;
  }

  if (existingTag.imageUrl || existingTag.imagePath) {
    const imageFilename = existingTag.imagePath
      ? existingTag.imagePath
      : existingTag.imageUrl.substring(
          existingTag.imageUrl.lastIndexOf('/') + 1,
        );

    await deleteFile(imageFilename);
  }

  return Tag.destroy({
    where: {
      id,
    },
  });
}

async function uploadImage(images) {
  if (!Object.values(images).length) {
    return;
  }

  const filesObject = Object.entries(images)
    .filter((_, index) => index == 0)
    .reduce((result, [key, value]) => ({ ...result, [key]: value }), {});
  const {
    parsedImages: [tagImage],
  } = await uploadFile(filesObject, getTagImagesDirectory());

  return tagImage;
}

function toDTO(tag) {
  const rawTag = tag.toJSON ? tag.toJSON() : tag;

  return {
    ...rawTag,
    imageUrl: rawTag.imagePath
      ? imagePathToImageUrl(rawTag.imagePath)
      : rawTag.imageUrl,
  };
}

module.exports = {
  findAll,
  findByIds,
  findByCodes,
  findById,
  create,
  update,
  deleteById,
  toDTO,
};
