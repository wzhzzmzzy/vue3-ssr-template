import { h, createApp } from "vue";
import { createRouter, createStore } from './plugins';
import App from '../src/App.vue';
// import { createHead } from '@vueuse/head';
// webpack config cannot process mjs file
const { createHead } = require('@vueuse/head/dist/index');

const clientRender = async () => {
  const app = createApp({
    render: () => h(App)
  });

  const head = createHead();
  const store = createStore()
  const router = createRouter({
    base: '/'
  });

  if (window.__INITIAL_DATA__) {
    store.state.value = window.__INITIAL_DATA__;
  }

  app.use(head);
  app.use(store);
  app.use(router);

  await router.isReady();
  router.beforeResolve((to, from, next) => {
    console.log(to, from);
    next();
  })

  window.__VUE_APP__ = app
  window.__VUE_ROUTER__ = router

  app.mount('#app', !!window.__USE_SSR__);

  // webpack hmr
  module?.hot?.accept?.()
}

export default clientRender();
