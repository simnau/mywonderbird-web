import firebase from 'firebase/app';
import 'firebase/auth';

import config from '../firebase-config';
import authModel from './authModel';

function initFirebase() {
  firebase.initializeApp(config);
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  firebase.auth().onAuthStateChanged(async user => {
    if (user) {
      await authModel.onAuth();
    } else {
      authModel.onUnauth();
    }
  });
}

export default initFirebase;
