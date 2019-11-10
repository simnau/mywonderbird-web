import axios from 'axios';
import qs from 'qs';

import { ACCESS_TOKEN_KEY, AUTHORIZATION_HEADER } from '../constants/auth';

const paramsSerializer = params => {
  return qs.stringify(params, { arrayFormat: 'bracakets' });
};

export const getAuthorizationHeaders = () => {
  const authorization = localStorage.getItem(ACCESS_TOKEN_KEY);
  return authorization ? { [AUTHORIZATION_HEADER]: authorization } : {};
};

export const get = (url, params = {}, config = {}) => {
  const headers = getAuthorizationHeaders();
  return axios.get(url, {
    ...config,
    paramsSerializer,
    params,
    headers: {
      ...config.headers,
      ...headers,
    },
  });
};

export const post = (url, body, params = {}, config = {}) => {
  const headers = getAuthorizationHeaders();
  return axios.post(url, body, {
    ...config,
    paramsSerializer,
    params,
    headers: {
      ...config.headers,
      ...headers,
    },
  });
};

export const put = (url, body, params = {}, config = {}) => {
  const headers = getAuthorizationHeaders();
  return axios.put(url, body, {
    ...config,
    paramsSerializer,
    params,
    headers: {
      ...config.headers,
      ...headers,
    },
  });
};

export const del = (url, params = {}, config = {}) => {
  const headers = getAuthorizationHeaders();
  return axios.delete(url, {
    ...config,
    paramsSerializer,
    params,
    headers: {
      ...config.headers,
      ...headers,
    },
  });
};
