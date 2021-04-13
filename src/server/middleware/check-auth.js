const config = require('config');
const admin = require('firebase-admin');

const { GUEST_ROLE } = require('../constants/roles');
const cognitoUtil = require('../util/cognito');
const profileService = require('../entities/profile/service');

const { header } = config.get('auth');

const BEARER_PREFIX = 'Bearer ';

async function handleFirebaseToken({ jwtToken, req, res, next }) {
  const decodedToken = await admin.auth().verifyIdToken(jwtToken);
    const user = await admin.auth().getUser(decodedToken.user_id);

    if (!user) {
      return res
        .status(404)
        .send({ error: 'User not found for the Authorization' });
    }

    const userProfile = await profileService.findOrCreateProfileByProviderId(
      user.uid,
    );

    const userData = {
      id: user.uid,
      provider: decodedToken.firebase.sign_in_provider,
      email: user.email,
      role: userProfile.role,
    };

    req.user = userData;
    req.isAuthenticated = true;

    return next();
}

const requireAuth = async (req, res, next) => {
  try {
    const jwtToken = req.header(header);

    if (!jwtToken) {
      req.user = {
        role: GUEST_ROLE,
      };
      return next();
    }

    if (jwtToken.startsWith(BEARER_PREFIX)) {
      return handleFirebaseToken({
        jwtToken: jwtToken.substring(BEARER_PREFIX.length),
        req,
        res,
        next,
      });
    }

    const { username } = await cognitoUtil.verifyToken(jwtToken);
    const user = await cognitoUtil.getUser(username);
    if (!user) {
      return res
        .status(404)
        .send({ error: 'User not found for the Authorization' });
    }

    const { identities, ...userData } = user;

    if (identities) {
      const identityData = JSON.parse(identities);

      userData.provider = identityData.length
        ? identityData[0].providerType
        : 'Cognito';
    } else {
      userData.provider = 'Cognito';
    }

    req.user = userData;
    req.isAuthenticated = true;
    return next();
  } catch (e) {
    return res
      .status(401)
      .send({ error: 'An error occured. Please try again.' });
  }
};

module.exports = requireAuth;
