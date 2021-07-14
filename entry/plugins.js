import { createRouter as createVueRouter, createWebHistory, createMemoryHistory } from "vue-router";
// import { createStore as createVuexStore } from 'vuex';
import { routes } from '../src/routes';
import createStore from '../src/store';

function createRouter (options = {}) {
  const base = options.base || '/';
  return createVueRouter({
    history: __isBrowser__ ? createWebHistory(base) : createMemoryHistory(),
    routes
  });
}

export {
  createRouter,
  createStore
}
