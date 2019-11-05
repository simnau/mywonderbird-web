const requireUnauth = (req, res, next) => {
  const { isAuthenticated } = req;
  if (isAuthenticated) {
    return res
      .status(403)
      .send({ error: 'User has to be unauthenticated to do this action' });
  }

  return next();
};

module.exports = requireUnauth;
