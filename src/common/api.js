import axios from 'axios'

let serverUrl = 'http://localhost:8888';

let traderUrl = serverUrl + '/trader';
let futureUrl = serverUrl + '/future';
let orderUrl = serverUrl + '/order';

export const requestLogin = params => {
  return axios.post(`${traderUrl}/login`, params)
};
export const requestRegister = params => {
  return axios.post(`${traderUrl}/register`, params)
};
export const requestFuturesList = params => {
  return axios.get(`${futureUrl}/getAllFutures`, {params: params})
};
export const sendOrder = params => {
  return axios.post(`${orderUrl}/sendOrder`, params)
};
export const requestFuturesCascader = params => {
  return axios.get(`${futureUrl}/getFuturesCascader`, {params: params})
};
export const requestOrderList = params => {
  return axios.get(`${orderUrl}/getOrders`, params)
};
