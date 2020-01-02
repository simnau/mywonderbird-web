const { Router } = require('express');
const asyncHandler = require('express-async-handler');

const service = require('./service');

const subscriptionRouter = Router();

subscriptionRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    await service.subscribe(email);

    res.send({ message: 'Successfully subscribed!' });
  }),
);

module.exports = subscriptionRouter;
