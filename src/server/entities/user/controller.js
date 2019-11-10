const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const { ADMIN_ROLE } = require('../../constants/roles');
const requireRole = require('../../middleware/require-role');
const service = require('./service');

const router = Router();

router.get(
  '/',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const { limit, paginationToken, filter } = req.query;
    const users = await service.getUsers(limit, paginationToken, filter);

    res.send(users);
  }),
);

router.post(
  '/',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const createdUser = await service.createUser(email);

    res.send(createdUser);
  }),
);

router.delete(
  '/:userId',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    await service.deleteUser(userId);

    res.sendStatus(200);
  }),
);

module.exports = router;
