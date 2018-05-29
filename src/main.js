// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import axios from 'axios'
import store from './store'
import './style/common.less'
import Common from './common/common'
import { refreshToken, isTokenAboutToExpired } from './common/api'

Vue.config.productionTip = false

Vue.component(CollapseTransition.name, CollapseTransition)

Vue.use(ElementUI)
Vue.use(Common)

// http request interceptor
axios.interceptors.request.use(
  config => {
    if (sessionStorage.getItem('token') !== null) {
      config.headers.Authorization = `Bearer ${sessionStorage.getItem('token')}`;
      if (isTokenAboutToExpired()) {
        refreshToken().then((res) => {
          if (res.data.status === 200 && res.data.message === 'success') {
            let token = res.data.data;
            sessionStorage.setItem('logintime', new Date().getTime().toString());
            sessionStorage.setItem('token', token);
          } else {
            sessionStorage.clear();
            ElementUI.Message.error('权限不足!');
            router.replace({
              path: '/login',
              query: { redirect: router.currentRoute.fullPath }
            })
          }
        });
      }
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// http response interceptor
/*
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          refreshToken().then((res) => {
            if (res.data.status === 200 && res.data.message === 'success') {
              let token = res.data.data;
              sessionStorage.setItem('token', token);
            } else {
              sessionStorage.clear();
              ElementUI.Message.error('权限不足!');
              router.replace({
                path: '/login',
                query: { redirect: router.currentRoute.fullPath }
              })
            }
          });
          break;
        case 400:
          sessionStorage.clear();
          ElementUI.Message.error('权限不足!');
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
          })
      }
    }
    return Promise.reject(error.response.data);
  }
);
*/


axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          sessionStorage.clear();
          ElementUI.Message.error('权限不足!');
          router.replace({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath }
          })
      }
    }
    return Promise.reject(error.response.data);
  }
);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
