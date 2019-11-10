const { Router } = require('express');

const journey = require('../entities/journey/controller');
const gemCaptures = require('../entities/gem-capture/controller');
const user = require('../entities/user/controller');
const authentication = require('../entities/authentication/controller');

const apiRouter = Router();

apiRouter.use('/journeys', journey);
apiRouter.use('/gem-captures', gemCaptures);
apiRouter.use('/users', user);
apiRouter.use('/auth', authentication);

module.exports = apiRouter;
