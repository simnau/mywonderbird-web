const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const { ADMIN_ROLE } = require('../../constants/roles');
const { getPlaceImagesDirectory } = require('../../util/file');
const { uploadFile } = require('../../util/file-upload');
const requireAuth = require('../../middleware/require-auth');
const requireRole = require('../../middleware/require-role');
const service = require('./service');
const placeImageService = require('../place-image/service');

const placeRouter = Router();

const DEFAULT_PAGE_SIZE = 20;

placeRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      query: { page = 1, pageSize = DEFAULT_PAGE_SIZE, q, countryCode, tags },
    } = req;

    const { places, total } = await service.findAllPaginated({
      page,
      pageSize,
      q,
      countryCode,
      tags,
    });

    const placeDTOs = await service.toDTOs(places);

    res.send({
      places: placeDTOs,
      total,
    });
  }),
);

placeRouter.get(
  '/location',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const {
      query: { lat, lng },
    } = req;

    const place = await service.findByLocation({ lat, lng });

    res.send({
      place,
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
      placeTags: placeTags ? JSON.parse(placeTags) : [],
    };

    const createdPlace = await service.createFull(place);
    if (files) {
      const { images } = await uploadFile(
        files,
        getPlaceImagesDirectory(createdPlace.id),
      );
      await placeImageService.createForPlace(
        createdPlace.id,
        images.map(image => ({ url: image, title: body.title, userId })),
      );
    }

    res.send({
      place: createdPlace,
    });
  }),
);

placeRouter.post(
  '/csv',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const {
      files,
      user: { id: userId },
    } = req;
    const fileArray = Object.values(files);

    if (!fileArray.length) {
      return res.send({
        message: 'Success',
      });
    }

    const [file] = fileArray;

    await service.createFromCSV(file, userId);

    res.send({
      message: 'Success',
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
      placeTags: placeTags ? JSON.parse(placeTags) : [],
      placeImages: placeImages ? JSON.parse(placeImages) : [],
    };

    const updatedPlace = await service.update(id, place);
    if (files) {
      const { images } = await uploadFile(files, getPlaceImagesDirectory(id));
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

    res.send({
      message: 'Place successfully deleted',
    });
  }),
);

module.exports = placeRouter;
