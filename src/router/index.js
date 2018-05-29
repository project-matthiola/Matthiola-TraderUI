import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/page/Login'
import Register from '@/page/Register'
import HelloWorld from '@/components/HelloWorld'
import TestWebSocket from '@/page/TestWebSocket'
import Market from '@/page/Market'
import Catalog from '@/page/Catalog'
import Order from '@/page/Order'
import Trade from '@/page/Trade'

Vue.use(Router);

let routes = [
  {
    path: '/login',
    name: 'login',
    meta: {
      index: 0
    },
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      index: 0
    },
    component: Register
  },
  {
    path: '/hello',
    name: 'hello',
    meta: {
      requireAuth: true
    },
    component: HelloWorld
  },
  {
    path: '/testWs',
    name: 'testWs',
    component: TestWebSocket
  },
  {
    path: '/market',
    name: 'market',
    meta: {
      index: 3
    },
    component: Market
  },
  {
    path: '/catalog',
    name: 'catalog',
    meta: {
      index: 2
    },
    component: Catalog
  },
  {
    path: '/myOrder',
    name: 'myOrder',
    meta: {
      index: 3
    },
    component: Order
  },
  {
    path: '/trade',
    name: 'trade',
    meta: {
      index: 4
    },
    component: Trade
  }
];

const router = new Router({ routes });

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (sessionStorage.getItem('token') !== null) {
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next();
  }
});

export default router
