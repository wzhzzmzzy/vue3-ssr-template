const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { promisify } = require('util');
const config = require('../config');

const { devPort, publicPath } = config;
const webpackStatsOption = {
  assets: true, // 添加资源信息
  cachedAssets: false, // 显示缓存的资源（将其设置为 `false` 则仅显示输出的文件）
  children: false, // 添加 children 信息
  chunks: false, // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
  colors: true, // 以不同颜色区分构建信息
  modules: false, // 添加构建模块信息
  errorDetails: true,
  warnings: false,
  entrypoints: false
}

const webpackPromisify = promisify(webpack)

const startClientServer = async webpackConfig => {
  return await new Promise((resolve) => {
    const compiler = webpack(webpackConfig)
    const server = new WebpackDevServer(compiler, {
      stats: webpackStatsOption,
      disableHostCheck: true,
      publicPath,
      sockPort: devPort,
      hot: true,
      port: devPort,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      }
    });

    compiler.hooks.done.tap('DonePlugin', () => {
      resolve()
    });
    server.listen(devPort);
  })
}

const startClientBuild = async (webpackConfig) => {
  const stats = await webpackPromisify(webpackConfig)
  console.log('[client]', stats.toString(webpackStatsOption))
}

const startServerBuild = async (webpackConfig) => {
  const stats = await webpackPromisify(webpackConfig)
  console.log(stats.toString(webpackStatsOption))
}

module.exports = {
  startClientServer,
  startClientBuild,
  startServerBuild
}
