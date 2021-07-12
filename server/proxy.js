const { createProxyMiddleware } = require('http-proxy-middleware');
const config = require('../config');

function onProxyReq (proxyReq, req) {
  Object.keys(req.headers).forEach(function (key) {
    proxyReq.setHeader(key, req.headers[key])
  })
}

const getDevProxyMiddlewaresArr = async () => {
  const { devPort, proxy, isDev } = config;
  const proxyMiddlewaresArr = []

  function registerProxy (proxy) {
    Object.keys(proxy).forEach(path => {
      const options = proxy[path]
      // 如果底层服务端框架是基于 express的。则不需要用 koaConnect 转换为 koa 中间件
      const middleware = createProxyMiddleware(path, options)
      proxyMiddlewaresArr.push(middleware)
    })
  }
  proxy && registerProxy(proxy)
  if (isDev) {
    // Webpack 场景 在本地开发阶段代理 serverPort 的资源到 devPort
    // 例如 http://localhost:3000/static/js/page.chunk.js -> http://localhost:8888/static/js/page.chunk.js
    const remoteStaticServerOptions = {
      target: `http://127.0.0.1:${devPort}`,
      changeOrigin: true,
      secure: false,
      onProxyReq: onProxyReq,
      logLevel: 'warn'
    }

    const proxyPathMap = {
      '/static': remoteStaticServerOptions,
      '/sockjs-node': remoteStaticServerOptions,
      '/*.hot-update**': remoteStaticServerOptions,
      '/__webpack_dev_server__': remoteStaticServerOptions,
      '/asset-manifest': remoteStaticServerOptions
    }
    registerProxy(proxyPathMap)
  }

  return proxyMiddlewaresArr
}

module.exports = getDevProxyMiddlewaresArr;
