import axios from 'axios';
import qs from 'qs';
import firebase from 'firebase/app';

import { REFRESH_TOKEN_URL } from '../constants/urls';
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  AUTHORIZATION_HEADER,
} from '../constants/auth';
import authModel from '../setup/authModel';

function paramsSerializer(params) {
  return qs.stringify(params, { arrayFormat: 'brackets' });
}

export async function getAuthorizationHeaders() {
  try {
    const idToken = await firebase.auth().currentUser.getIdToken(true);

    return idToken ? { [AUTHORIZATION_HEADER]: idToken } : {};
  } catch (e) {
    return {};
  }
}

async function refreshToken() {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (!refreshToken) {
    throw new Error('No refresh token found');
  }

  return axios.post(REFRESH_TOKEN_URL, {
    refreshToken,
  });
}

async function enhancedFetch(config, retry = false) {
  const headers = await getAuthorizationHeaders();

  return axios({
    ...config,
    paramsSerializer,
    headers: {
      ...config.headers,
      ...headers,
    },
  }).catch(async e => {
    if (e.response.status === 401 && !retry) {
      const { data } = await refreshToken();
      localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
      return enhancedFetch(config, true).catch(e => {
        if (e.response.status === 401) {
          authModel.logout();
        }
        throw e;
      });
    }

    throw e;
  });
}

export function get(url, params = {}, config = {}) {
  return enhancedFetch({
    ...config,
    method: 'get',
    params,
    url,
  });
}

export function post(url, body, params = {}, config = {}) {
  return enhancedFetch({
    ...config,
    data: body,
    method: 'post',
    params,
    url,
  });
}

export function put(url, body, params = {}, config = {}) {
  return enhancedFetch({
    ...config,
    data: body,
    method: 'put',
    params,
    url,
  });
}

export function del(url, params = {}, config = {}) {
  return enhancedFetch({
    ...config,
    method: 'delete',
    params,
    url,
  });
}
