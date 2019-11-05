const requireAuth = (req, res, next) => {
  const { isAuthenticated } = req;
  if (!isAuthenticated) {
    return res
      .status(401)
      .send({ error: 'Authentication is required' });
  }

  return next();
};

module.exports = requireAuth;
