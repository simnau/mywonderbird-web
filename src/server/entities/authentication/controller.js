const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const requireUnauth = require('../../middleware/require-unauth');
const requireAuth = require('../../middleware/require-auth');
const service = require('./service');

const authenticationRouter = Router();

authenticationRouter.post(
  '/register',
  requireUnauth,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await service.register(email, password);
    return res.send(user);
  }),
);

authenticationRouter.post(
  '/confirm',
  requireUnauth,
  asyncHandler(async (req, res) => {
    const { email, code } = req.body;

    service.confirm(email, code, (err, result) => {
      if (err) {
        return res.status(400).send(err.message);
      }

      return res.send(result);
    });
  }),
);

authenticationRouter.post(
  '/code',
  requireUnauth,
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    service.sendConfirmationCode(email, (err, result) => {
      if (err) {
        return res.status(400).send(err.message);
      }

      return res.send(result);
    });
  }),
);

authenticationRouter.post(
  '/login',
  requireUnauth,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const result = await service.login(email, password);
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

module.exports = authenticationRouter;
