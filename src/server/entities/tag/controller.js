const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const service = require('./service');

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const tags = await service.findAll();

  res.send({ tags });
}));

module.exports = router;
