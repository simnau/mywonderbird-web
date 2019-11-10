import { action, observable } from 'mobx';

import { get, post } from '../../util/fetch';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../../constants/auth';

export default class AuthModel {
  @observable isAuthenticated = false;
  @observable role = 'GUEST';

  @action
  login = async ({ email, password }) => {
    const result = await post('/api/auth/login', { email, password });

    if (result.status !== 200) {
      throw new Error('Unable to login');
    } else {
      this.isAuthenticated = true;
      this.role = result.data.role;

      localStorage.setItem(ACCESS_TOKEN_KEY, result.data.accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, result.data.refreshToken);
    }
  };

  @action
  reauthenticateFromStorage = async () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (accessToken) {
      try {
        const result = await get('/api/auth/me');

        if (result.status !== 200) {
          throw new Error('Unable to get user data');
        } else {
          this.isAuthenticated = true;
          this.role = result.data.role;
        }
      } catch (e) {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
      }
    }
  };

  @action
  logout = () => {
    this.isAuthenticated = false;
    this.role = null;

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  };
}
