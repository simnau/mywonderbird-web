const { Router } = require('express');

const journey = require('../entities/journey/controller');
const gemCaptures = require('../entities/gem-capture/controller');
const authentication = require('../entities/authentication/controller');

const apiRouter = Router();

apiRouter.use('/journeys', journey);
apiRouter.use('/gem-captures', gemCaptures);
apiRouter.use('/auth', authentication);

module.exports = apiRouter;
