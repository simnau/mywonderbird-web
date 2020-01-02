const { Router } = require('express');

const journey = require('../entities/journey/controller');
const gemCaptures = require('../entities/gem-capture/controller');
const user = require('../entities/user/controller');
const profile = require('../entities/profile/controller');
const authentication = require('../entities/authentication/controller');
const oauth = require('../entities/oauth/controller');
const geo = require('../entities/geo/controller');
const subscription = require('../entities/subscription/controller');

const apiRouter = Router();

apiRouter.use('/journeys', journey);
apiRouter.use('/gem-captures', gemCaptures);
apiRouter.use('/users', user);
apiRouter.use('/profile', profile);
apiRouter.use('/auth', authentication);
apiRouter.use('/oauth', oauth);
apiRouter.use('/geo', geo);
apiRouter.use('/subscription', subscription);

module.exports = apiRouter;
