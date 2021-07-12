import { h, createApp } from "vue";
import { createRouter, createStore } from './plugins';
import App from '../src/App.vue';

const clientRender = async () => {
  const store = createStore()
  const router = createRouter({
    base: '/'
  });

  if (window.__INITIAL_DATA__) {
    store.replaceState(window.__INITIAL_DATA__);
  }

  const app = createApp({
    render: () => h(App)
  });

  app.use(store);
  app.use(router);

  await router.isReady();

  window.__VUE_APP__ = app
  window.__VUE_ROUTER__ = router

  app.mount('#app', !!window.__USE_SSR__);
}

export default clientRender();
