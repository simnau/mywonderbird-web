import axios from 'axios';
import qs from 'qs';

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

export function getAuthorizationHeaders() {
  const authorization = localStorage.getItem(ACCESS_TOKEN_KEY);
  return authorization ? { [AUTHORIZATION_HEADER]: authorization } : {};
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

function enhancedFetch(config, retry = false) {
  const headers = getAuthorizationHeaders();

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
