import axios from 'axios'

let serverUrl = 'http://localhost:8888';

let traderUrl = serverUrl + '/trader';
let futureUrl = serverUrl + '/future';
let orderUrl = serverUrl + '/order';
let brokerUrl = serverUrl + '/broker';
let tradeUrl = serverUrl + '/trade';

export const refreshToken = () => {
  return axios.get(`${traderUrl}/refreshToken`, {params: {}})
};
export const isTokenAboutToExpired = () => {
  let logintime = parseInt(sessionStorage.getItem('logintime'));
  let current = new Date().getTime();
  let stamp = current - logintime;
  let minutes = parseInt((stamp % (1000 * 60 * 60)) / (1000 * 60));
  console.log(logintime);
  console.log(current);
  console.log(minutes);
  return minutes >= 20;
};
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
export const cancelOrder = params => {
  return axios.post(`${orderUrl}/cancelOrder`, params)
};
export const requestFuturesCascader = params => {
  return axios.get(`${futureUrl}/getFuturesCascader`, {params: params})
};
export const requestOrderList = params => {
  return axios.get(`${orderUrl}/getOrders`, {params: params})
};
export const requestBrokers = () => {
  return axios.get(`${brokerUrl}/getAllBrokers`, {params: {}})
};
export const requestTradeList = params => {
  return axios.get(`${tradeUrl}/getTrades`, {params: params})
};
