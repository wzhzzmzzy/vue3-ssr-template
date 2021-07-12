import App from '../src/App.vue';
import Layout from '../src/Layout.vue';

const routes = [
  {
    name: 'index',
    path: '/',
    component: __isBrowser__
      ? () => import(/* webpackChunkName: "index" */ '../src/views/index.vue')
      : require('../src/views/index.vue').default,
    webpackChunkName: 'index'
  },
  {
    name: 'counter',
    path: '/c',
    component: __isBrowser__
      ? () => import(/* webpackChunkName: "counter" */ '../src/views/counter.vue')
      : require('../src/views/counter.vue').default,
    webpackChunkName: 'counter'
  }
];

export {
  routes,
  App,
  Layout
}
