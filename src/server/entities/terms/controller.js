const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const { TYPES } = require('../../constants/terms');
const { ADMIN_ROLE } = require('../../constants/roles');
const requireRole = require('../../middleware/require-role');
const service = require('./service');

const termsRouter = Router();

termsRouter.get(
  '/',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const terms = await service.findAll();

    res.send(terms);
  }),
);

termsRouter.get(
  '/latest',
  asyncHandler(async (req, res) => {
    const latestTerms = await service.findLatestByTypes();

    res.send(latestTerms);
  }),
);

termsRouter.post(
  '/',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const { body: terms } = req;
    try {
      const createdTerms = await service.create(terms);

      return res.send(createdTerms);
    } catch (e) {
      if (e.name === 'SequelizeUniqueConstraintError') {
        return res.send({
          error: 'Terms with the same type and url already exist',
        });
      }

      throw e;
    }
  }),
);

termsRouter.get(
  '/types',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    res.send(TYPES);
  }),
);

termsRouter.delete(
  '/:id',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const {
      params: { id },
    } = req;

    await service.deleteById(id);
    res.send({ message: 'Terms successfully deleted' });
  }),
);

module.exports = termsRouter;
