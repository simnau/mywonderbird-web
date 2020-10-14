const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const router = Router();

router.post(
  '/places',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body: { q, types },
    } = req;

    const places = await service.search(q, types);

    res.send({
      places,
    });
  }),
);

module.exports = router;
