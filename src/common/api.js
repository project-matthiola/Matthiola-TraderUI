import axios from 'axios'

let serverUrl = 'http://localhost:8080';

let traderUrl = serverUrl + '/trader';

export const requestLogin = params => {
  return axios.post(`${traderUrl}/login`, params)
};
export const requestRegister = params => {
  return axios.post(`${traderUrl}/register`, params)
};
