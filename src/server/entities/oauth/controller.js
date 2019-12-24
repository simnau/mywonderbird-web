const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const service = require('./service');

const oauthRouter = Router();

oauthRouter.get(
  '/authorize-url',
  asyncHandler(async (req, res) => {
    const authorizeUrl = service.getAuthorizeUrl();

    res.send({
      authorizeUrl,
    });
  }),
);

oauthRouter.get(
  '/login',
  asyncHandler(async (req, res) => {
    const { code, redirectUri } = req.query;

    const loginResult = await service.login(code, redirectUri);

    res.send(loginResult);
  }),
);

oauthRouter.get(
  '/register',
  asyncHandler(async (req, res) => {
    const { code, redirectUri } = req.query;

    const registerResult = await service.register(code, redirectUri);

    res.send(registerResult);
  }),
)

module.exports = oauthRouter;
