import { h, createSSRApp } from 'vue';
import { createHead } from '@vueuse/head';
// import devalue from '@nuxt/devalue';
import { createRouter, createStore } from './plugins';
import { findRoute } from "./utils";
import { Layout, App, routes } from '../src/routes';
const { getManifest } = require('../utils');

const serverRender = async (req, config) => {
  global.window = global.window || {} // 防止覆盖上层应用自己定义的 window 对象
  global.__VUE_PROD_DEVTOOLS__ = global.__VUE_PROD_DEVTOOLS__ || false
  const router = createRouter();
  const store = createStore();
  const head = createHead();
  const path = req.path;
  const { cssOrder, jsOrder } = config;
  const routeItem = findRoute(routes, path);

  const dynamicCssOrder = cssOrder.concat([`${routeItem.webpackChunkName}.css`])
  const manifest = await getManifest();
  router.push(path)
  await router.isReady();

  const injectCss = [];
  dynamicCssOrder.forEach(css => {
    if (manifest[css]) {
      injectCss.push(
        h('link', {
          rel: 'stylesheet',
          href: manifest[css]
        })
      )
    }
  });
  const injectScript = jsOrder.map(js =>
    h('script', {
      src: manifest[js]
    })
  );

  const app = createSSRApp({
    render: function () {
      return h(
        Layout,
        { req, config },
        {
          children: () => h(App),
          initialData: () => h('script', {
            innerHTML: `window.__USE_SSR__=true; window.__INITIAL_DATA__ =${JSON.stringify(store.state.value)};`
          }),
          cssInject: () => injectCss,
          jsInject: () => injectScript
        }
      )
    }
  })

  app.use(router)
  app.use(store)
  app.use(head)
  await router.isReady()

  window.__VUE_APP__ = app
  return app
}

export default serverRender
