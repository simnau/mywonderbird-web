const jwt = require('jsonwebtoken');

function verifyToken(pems, token) {
  return new Promise((resolve, reject) => {
    const decodedJwt = jwt.decode(token, { complete: true });

    if (!decodedJwt) {
      return reject(new Error('Not a valid JWT token'));
    }

    const keyId = decodedJwt.header.kid;
    const pem = pems[keyId];
    if (!pem) {
      return reject(new Error('Invalid token'));
    }

    jwt.verify(token, pem, function(err, payload) {
      if (err) {
        return reject(new Error('Invalid token'));
      }

      return resolve(payload);
    });
  });
}

module.exports = {
  verifyToken,
};
