import axios from 'axios'

let serverUrl = 'http://localhost:8888';

let traderUrl = serverUrl + '/trader';

let futureUrl = serverUrl + '/future';

export const requestLogin = params => {
  return axios.post(`${traderUrl}/login`, params)
};
export const requestRegister = params => {
  return axios.post(`${traderUrl}/register`, params)
};
export const requestFuturesList = params => {
  return axios.get(`${futureUrl}/getAllFutures`, {params: params})
};
