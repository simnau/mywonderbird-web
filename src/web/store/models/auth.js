import { action, observable } from 'mobx';
import firebase from 'firebase/app';

import { get } from '../../util/fetch';
import {
  AUTHENTICATION_STATUSES,
} from '../../constants/auth';

export default class AuthModel {
  @observable authenticationStatus = AUTHENTICATION_STATUSES.UNKNOWN;
  @observable role = 'GUEST';

  @action
  login = async ({ email, password }) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (e) {
      throw new Error('Unable to login');
    }
  };

  @action
  logout = async () => {
    await firebase.auth().signOut();
  };

  @action
  onAuth = async () => {
    try {
      const result = await get('/api/auth/me');

      this.role = result.data.role;
      this.authenticationStatus = AUTHENTICATION_STATUSES.AUTHENTICATED;
    } catch (e) {
      throw new Error('There was an auth error');
    }
  };

  @action onUnauth = () => {
    this.authenticationStatus = AUTHENTICATION_STATUSES.UNAUTHENTICATED;
    this.role = null;
  };
}
