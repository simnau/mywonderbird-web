const { Router } = require('express');

const journey = require('../entities/journey/controller');

const apiRouter = Router();

apiRouter.use('/journeys', journey);

module.exports = apiRouter;
