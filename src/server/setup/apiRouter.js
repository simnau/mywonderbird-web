const { Router } = require('express');

const journey = require('../entities/journey/controller');
const gemCaptures = require('../entities/gem-capture/controller');

const apiRouter = Router();

apiRouter.use('/journeys', journey);
apiRouter.use('/gem-captures', gemCaptures);

module.exports = apiRouter;
