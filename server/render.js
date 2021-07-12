const path = require('path');
const { renderToString } = require('@vue/server-renderer');
const { getCwd } = require('../utils');
const config = require('../config');

async function render(req, res) {
  const { isDev, chunkName } = config;
  const isLocal = isDev || process.env.NODE_ENV !== 'production';
  const serverBundle = path.resolve(getCwd(), `./build/server/${chunkName}.server.js`);
  if (isLocal) {
    delete require.cache[serverBundle];
  }
  const serverRender = require(serverBundle).default;
  const serverRes = await serverRender(req, config)
  const html = await renderToString(serverRes);
  res.type('html').status(200).send(html)
}

module.exports = render;
