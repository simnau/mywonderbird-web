const { Router } = require('express');

const journey = require('../entities/journey/controller');
const gemCaptures = require('../entities/gem-capture/controller');
const user = require('../entities/user/controller');
const profile = require('../entities/profile/controller');
const authentication = require('../entities/authentication/controller');
const geo = require('../entities/geo/controller');

const apiRouter = Router();

apiRouter.use('/journeys', journey);
apiRouter.use('/gem-captures', gemCaptures);
apiRouter.use('/users', user);
apiRouter.use('/profile', profile);
apiRouter.use('/auth', authentication);
apiRouter.use('/geo', geo);

module.exports = apiRouter;
