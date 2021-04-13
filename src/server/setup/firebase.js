const admin = require('firebase-admin');
const base64 = require('base-64');
const config = require('config');

const serviceKeyBase64 = config.get('google.serviceKey');

const serviceKey = base64.decode(serviceKeyBase64);

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceKey)),
});
