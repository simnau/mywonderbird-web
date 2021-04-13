const admin = require('firebase-admin');
const config = require('config');

const serviceKey = config.get('google.serviceKey');

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceKey)),
});
