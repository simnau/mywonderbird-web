const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const { ADMIN_ROLE } = require('../../constants/roles');
const requireRole = require('../../middleware/require-role');
const service = require('./service');

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const tags = await service.findAll();

    res.send({ tags: tags.map(service.toDTO) });
  }),
);

router.get(
  '/:id',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const {
      params: { id },
    } = req;

    const tag = await service.findById(id);

    res.send({ tag: service.toDTO(tag) });
  }),
);

router.post(
  '/',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const { body, files } = req;

    const createdTag = await service.create(body, { images: files });

    res.send({ tag: service.toDTO(createdTag) });
  }),
);

router.put(
  '/:id',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const {
      body,
      files,
      params: { id },
    } = req;
    const updatedTag = await service.update(id, body, { images: files });

    res.send({ tag: service.toDTO(updatedTag) });
  }),
);

router.delete(
  '/:id',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const {
      params: { id },
    } = req;

    await service.deleteById(id);

    res.send({ message: 'Tag deleted successfully' });
  }),
);

module.exports = router;
