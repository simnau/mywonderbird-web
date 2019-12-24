const config = require('config');

const { GUEST_ROLE } = require('../constants/roles');
const cognitoUtil = require('../util/cognito');

const { header } = config.get('auth');

const requireAuth = async (req, res, next) => {
  try {
    const jwtToken = req.header(header);

    if (!jwtToken) {
      req.user = {
        role: GUEST_ROLE,
      };
      return next();
    }

    const { username } = await cognitoUtil.verifyToken(jwtToken);
    const user = await cognitoUtil.getUser(username);
    if (!user) {
      return res
        .status(404)
        .send({ error: 'User not found for the Authorization' });
    }

    const { identities, ...userData } = user;

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
