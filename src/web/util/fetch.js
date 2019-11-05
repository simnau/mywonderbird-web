import axios from 'axios';

import { ACCESS_TOKEN_KEY, AUTHORIZATION_HEADER } from '../constants/auth';

export const getAuthorizationHeaders = () => {
  const authorization = localStorage.getItem(ACCESS_TOKEN_KEY);
  return authorization ? { [AUTHORIZATION_HEADER]: authorization } : {};
};

export const get = (url, queryParams = {}, config = {}) => {
  const headers = getAuthorizationHeaders();
  return axios.get(url, {
    ...config,
    queryParams,
    headers: {
      ...config.headers,
      ...headers,
    },
  });
};

export const post = (url, body, queryParams = {}, config = {}) => {
  const headers = getAuthorizationHeaders();
  return axios.post(url, body, {
    ...config,
    queryParams,
    headers: {
      ...config.headers,
      ...headers,
    },
  });
};

export const put = (url, body, queryParams = {}, config = {}) => {
  const headers = getAuthorizationHeaders();
  return axios.put(url, body, {
    ...config,
    queryParams,
    headers: {
      ...config.headers,
      ...headers,
    },
  });
};

export const del = (url, queryParams = {}, config = {}) => {
  const headers = getAuthorizationHeaders();
  return axios.delete(url, {
    ...config,
    queryParams,
    headers: {
      ...config.headers,
      ...headers,
    },
  });
};
