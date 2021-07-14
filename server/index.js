const path = require('path');
const express = require('express');
const favicon = require('serve-favicon');
const render = require('./render');
const getDevProxyMiddlewaresArr = require('./proxy');
const config = require('../config');

async function createServer() {
  const { serverPort, faviconPath } = config;
  const app = express();

  app.use(favicon(path.resolve(faviconPath)));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const proxyMiddlewaresArr = await getDevProxyMiddlewaresArr()
  for (const middleware of proxyMiddlewaresArr) {
    app.use(middleware)
  }

  app.get('*', render);

  app.use((err, req, res, next) => {
    res.send({
      code: 500,
      msg: err.message ? err.message : err.toString(),
    });
  });

  app.listen(serverPort);
}

module.exports = createServer;
