const webpack = require('webpack');
const path = require('path');
const config = require('../config');
const getBaseConfig = require('./base');
const { getCwd } = require('../utils');
const nodeExternals = require('../utils/externals');
const loadModule = require.resolve

const getServerWebpack = chain => {
  const { isDev, chunkName } = config;

  getBaseConfig(chain, true)
  chain.devtool(isDev ? 'inline-source-map' : false)

  chain.target('node')
  chain.entry(chunkName)
    .add(loadModule('../entry/server'))
    .end()
    .output
    .path(path.join(getCwd(), './build/server'))
    .filename('[name].server.js')
    .libraryTarget('commonjs')
    .end();

  chain.externals([
    nodeExternals({
      whitelist: [/\.(css|less|sass|scss)$/],
      modulesDir: [
        path.join(getCwd(), './node_modules'),
        path.resolve(getCwd(), '../node_modules')
      ]
    })
  ]);

  chain.when(isDev, () => {
    chain.watch(true)
  });

  chain.plugin('define').use(webpack.DefinePlugin, [{
    __isBrowser__: false
  }]);

  return chain.toConfig()
}

module.exports = getServerWebpack;
