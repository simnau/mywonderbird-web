const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const { ADMIN_ROLE, USER_ROLE } = require('../../constants/roles');
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

router.get(
  '/roles',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const roles = [
      USER_ROLE,
      ADMIN_ROLE,
    ];

    res.send({ roles });
  }),
);

router.get(
  '/:id',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const {
      params: { id },
    } = req;
    const user = await service.getUser(id);

    res.send({ user });
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

router.put(
  '/:email',
  requireRole(ADMIN_ROLE),
  asyncHandler(async (req, res) => {
    const {
      params: { email },
      body: { role },
    } = req;

    const updatedUser = await service.updateUser(email, { role });

    res.send(updatedUser);
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
