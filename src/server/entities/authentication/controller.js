const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const segmentUtil = require('../../util/segment');
const requireUnauth = require('../../middleware/require-unauth');
const requireAuth = require('../../middleware/require-auth');
const service = require('./service');
const { USERNAME_EXISTS } = require('../../constants/cognito');

const authenticationRouter = Router();

authenticationRouter.post(
  '/register',
  requireUnauth,
  asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await service.register(email, password);
      return res.send(user);
    } catch (e) {
      if (e.code == USERNAME_EXISTS) {
        e.status = 403;
      }
      throw e;
    }
  }),
);

authenticationRouter.post(
  '/confirm',
  requireUnauth,
  asyncHandler(async (req, res) => {
    const { email, code } = req.body;

    const result = await service.confirm(email, code);

    return res.send({ result });
  }),
);

authenticationRouter.post(
  '/code',
  requireUnauth,
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const result = await service.sendConfirmationCode(email);

    return res.send(result);
  }),
);

authenticationRouter.post(
  '/login',
  requireUnauth,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await service.login(email, password);
    segmentUtil.trackLogin(result.userId);

    res.send(result);
  }),
);

authenticationRouter.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    return res.send(req.user);
  }),
);

authenticationRouter.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const tokens = await service.refreshToken(refreshToken);

    return res.send(tokens);
  }),
);

authenticationRouter.post(
  '/forgot-password',
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await service.forgotPassword(email);

    return res.send(result);
  }),
);

authenticationRouter.post(
  '/reset-password',
  asyncHandler(async (req, res) => {
    const { email, password, code } = req.body;
    const result = await service.resetPassword(email, password, code);

    return res.send(result);
  }),
);

authenticationRouter.post(
  '/change-password',
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      body: { currentPassword, newPassword },
      user: { provider, email },
    } = req;

    if (provider !== 'Cognito') {
      return res.status(403).send({
        error:
          'Only accounts with username/password login method can change passwords',
      });
    }

    await service.changePassword(email, currentPassword, newPassword);

    return res.send({
      message: 'Password changed successfully',
    });
  }),
);

authenticationRouter.post(
  '/force-change-password',
  asyncHandler(async (req, res) => {
    const {
      body: { email, currentPassword, newPassword },
    } = req;

    await service.forceChangePassword(email, currentPassword, newPassword);

    return res.send({
      message: 'Password changed successfully',
    });
  }),
);

authenticationRouter.post(
  '/temporary-password',
  asyncHandler(async (req, res) => {
    const {
      body: { email },
    } = req;

    await service.createTemporaryPassword(email);

    return res.send({
      message: 'A temporary password has been sent to the email provided',
    });
  }),
);

module.exports = authenticationRouter;
