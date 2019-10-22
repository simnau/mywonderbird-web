import axios from 'axios';

export function get(url, queryParams) {
  return axios.get(url, {
    queryParams,
  });
}

export function post(url, data, queryParams) {
  return axios.post(url, data, { queryParams });
}

export function put(url, data, queryParams) {
  return axios.put(url, data, { queryParams });
}

export function del(url, queryParams) {
  return axios.delete(url, { queryParams });
}
