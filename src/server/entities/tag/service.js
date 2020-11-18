const { Op } = require('sequelize');

const { Tag } = require('../../orm/models/tag');
const { getTagImagePath, getTagImagesDirectory } = require('../../util/file');
const { uploadFile } = require('../../util/file-upload');
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
    const imageUrl = await uploadImage(images);

    return Tag.create({
      ...tag,
      imageUrl,
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

  if (existingTag.imageUrl && tag.imageUrl !== existingTag.imageUrl) {
    const imageFilename = existingTag.imageUrl.substring(
      existingTag.imageUrl.lastIndexOf('/') + 1,
    );
    const s3Filename = getTagImagePath(imageFilename);

    await deleteFile(s3Filename);
  }

  if (images) {
    const imageUrl = await uploadImage(images);

    return existingTag.update({
      ...tag,
      imageUrl,
    });
  }

  return existingTag.update(tag);
}

async function deleteById(id) {
  const existingTag = await findById(id);

  if (!existingTag) {
    return;
  }

  if (existingTag.imageUrl) {
    const imageFilename = existingTag.imageUrl.substring(
      existingTag.imageUrl.lastIndexOf('/') + 1,
    );
    const s3Filename = getTagImagePath(imageFilename);

    await deleteFile(s3Filename);
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
    images: [tagImage],
  } = await uploadFile(filesObject, getTagImagesDirectory());

  return tagImage;
}

module.exports = {
  findAll,
  findByIds,
  findByCodes,
  findById,
  create,
  update,
  deleteById,
};
