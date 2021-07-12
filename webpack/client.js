const path = require('path');
const webpack = require('webpack');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const safePostCssParser = require('postcss-safe-parser');
const config = require('../config');
const { getCwd } = require('../utils');
const getBaseConfig = require('./base');
const loadModule = require.resolve

const getClientWebpack = chain => {
  const { publicPath, chunkName } = config;
  const isDev = process.env.NODE_ENV !== 'production'
  const truePublicPath = isDev ? publicPath : `${publicPath}client/`

  getBaseConfig(chain, false);

  chain.devtool(isDev ? 'cheap-module-source-map' : false);
  chain.entry(chunkName)
    .add(loadModule('../entry/client'))
    .end()
    .output
    .path(path.join(getCwd(), './build/client'))
    .filename(!isDev ? 'static/js/[name].[contenthash:8].js' : 'static/js/[name].js')
    .chunkFilename(!isDev ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js')
    .publicPath(truePublicPath)
    .set('clean', true)
    .end()

  chain.optimization
    .runtimeChunk(true)
    .splitChunks({
      chunks: 'initial',
      name: 'false',
      cacheGroups: {
        vendors: {
          test: module => {
            return module.resource &&
              /\.js$/.test(module.resource) &&
              module.resource.match('node_modules')
          },
          name: 'vendor'
        }
      }
    })
    .when(!isDev, optimization => {
      optimization.minimizer('terser')
        .use(loadModule('terser-webpack-plugin'), [{
          terserOptions: {
            parse: {
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2
            },
            mangle: {
              safari10: true
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true
            }
          },
          extractComments: false,
          parallel: true,
        }])
      optimization.minimizer('optimize-css').use(loadModule('optimize-css-assets-webpack-plugin'), [{
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: {
            inline: false,
            annotation: true
          }
        }
      }])
    })

  chain.plugin('define').use(webpack.DefinePlugin, [{
    __isBrowser__: true
    // __VUE_OPTIONS_API__: false // 配置后与 vuex 集成有bug，暂时不打开
  }])

  chain.plugin('manifest').use(WebpackManifestPlugin, [{
    fileName: 'asset-manifest.json',
    publicPath: truePublicPath
  }])

  // chain.plugin('analyze').use(BundleAnalyzerPlugin)

  return chain.toConfig()
}

module.exports = getClientWebpack;
