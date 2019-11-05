const requireRole = (...requiredRoles) => (req, res, next) => {
  const { user } = req;
  if (!user || !user.role || !requiredRoles.includes(user.role)) {
    return res
      .status(403)
      .send({ error: 'The user is not authorized to do this action' });
  }

  return next();
};

module.exports = requireRole;
