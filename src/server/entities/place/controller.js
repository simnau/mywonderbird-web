const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const { ADMIN_ROLE } = require('../../constants/roles');
const { getPlaceImagesDirectory } = require('../../util/file');
const fileUploader = require('../../util/file-upload');
const requireAuth = require('../../middleware/require-auth');
const requireRole = require('../../middleware/require-role');
const service = require('./service');
const placeImageService = require('../place-image/service');
const { deleteFolder } = require('../../util/s3');

const placeRouter = Router();

const DEFAULT_PAGE_SIZE = 20;

placeRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      query: { page = 1, pageSize = DEFAULT_PAGE_SIZE },
    } = req;

    const { places, total } = await service.findAllPaginated({
      page,
      pageSize,
    });

    const placeDTOs = await service.toDTOs(places);

    res.send({
      places: placeDTOs,
      total,
    });
  }),
);

placeRouter.get(
  '/:id',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const {
      params: { id },
    } = req;

    const place = await service.findById(id);
    const placeDTO = await service.toDTO(place);

    res.send({
      place: placeDTO,
    });
  }),
);

placeRouter.post(
  '/',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const {
      body: { placeTags, ...body },
      files,
      user: { id: userId },
    } = req;

    const place = {
      ...body,
      placeTags: JSON.parse(placeTags),
    };

    const createdPlace = await service.createFull(place);
    const { images } = await fileUploader(
      files,
      getPlaceImagesDirectory(createdPlace.id),
    );
    await placeImageService.createForPlace(
      createdPlace.id,
      images.map(image => ({ url: image, title: body.title, userId })),
    );

    res.send({
      place: createdPlace,
    });
  }),
);

placeRouter.put(
  '/:id',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const {
      body: { placeTags, placeImages, ...body },
      files,
      params: { id },
      user: { id: userId },
    } = req;

    const place = {
      ...body,
      placeTags: JSON.parse(placeTags),
      placeImages: JSON.parse(placeImages),
    };

    const updatedPlace = await service.update(id, place);
    if (files) {
      const { images } = await fileUploader(
        files,
        getPlaceImagesDirectory(id),
      );
      await placeImageService.createForPlace(
        id,
        images.map(image => ({ url: image, title: body.title, userId })),
      );
    }

    res.send({
      place: updatedPlace,
    });
  }),
);

placeRouter.delete(
  '/:id',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const {
      params: { id },
    } = req;

    await service.deleteById(id);
    await deleteFolder(getPlaceImagesDirectory(id));

    res.send({
      message: 'Place successfully deleted',
    });
  }),
);

module.exports = placeRouter;
