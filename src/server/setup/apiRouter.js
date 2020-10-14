const { Router } = require('express');

const journey = require('../entities/journey/controller');
const favoriteJourney = require('../entities/favorite-journey/controller');
const gemCaptures = require('../entities/gem-capture/controller');
const user = require('../entities/user/controller');
const profile = require('../entities/profile/controller');
const authentication = require('../entities/authentication/controller');
const oauth = require('../entities/oauth/controller');
const geo = require('../entities/geo/controller');
const subscription = require('../entities/subscription/controller');
const picture = require('../entities/picture/controller');
const like = require('../entities/like/controller');
const bookmark = require('../entities/bookmark/controller');
const bookmarkGroups = require('../entities/bookmark-group/controller');
const suggestions = require('../entities/suggestion/controller');
const savedTrips = require('../entities/saved-trip/controller');
const search = require('../entities/search/controller');

const journeyComment = require('../entities/journey-comment/controller');
const journeyLike = require('../entities/journey-like/controller');
const tutorialStep = require('../entities/tutorial-step/controller');
const userTutorialStep = require('../entities/user-tutorial-step/controller');
const terms = require('../entities/terms/controller');

const apiRouter = Router();

apiRouter.use('/pictures', picture);
apiRouter.use('/likes', like);
apiRouter.use('/bookmarks', bookmark);
apiRouter.use('/bookmark-groups', bookmarkGroups);
apiRouter.use('/suggestions', suggestions);
apiRouter.use('/saved-trips', savedTrips);
apiRouter.use('/search', search);

apiRouter.use('/journeys', journey);
apiRouter.use('/favorite-journeys', favoriteJourney);
apiRouter.use('/gem-captures', gemCaptures);
apiRouter.use('/users', user);
apiRouter.use('/profile', profile);
apiRouter.use('/auth', authentication);
apiRouter.use('/oauth', oauth);
apiRouter.use('/geo', geo);
apiRouter.use('/subscription', subscription);
apiRouter.use('/journey-comments', journeyComment);
apiRouter.use('/journey-likes', journeyLike);
apiRouter.use('/tutorial-steps', tutorialStep);
apiRouter.use('/user-tutorial-steps', userTutorialStep);
apiRouter.use('/terms', terms);

module.exports = apiRouter;
