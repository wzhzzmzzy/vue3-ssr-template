const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');
const { getCwd } = require('../utils');
const setStyle = require('../utils/setStyle');
const addBabelLoader = require('../utils/getBabelLoader');
const loadModule = require.resolve;

const getBaseConfig = (chain, isServer) => {
  const mode = process.env.NODE_ENV;
  const isDev = process.env.NODE_ENV !== 'production'
  const vueLoaderOptions = {
    babelParserPlugins: ['jsx', 'classProperties', 'decorators-legacy']
  }

  chain.resolve
    .extensions
    .merge(['.js', '.jsx', '.vue', '.json'])
    .end();

  chain.module
    .noParse(/^(vue|vue-router|vuex)$/);

  chain.mode(mode);

  chain.module.strictExportPresence(true);
  chain
    .resolve
    .modules
    .add('node_modules')
    .add(path.join(getCwd(), './node_modules'))
    .when(isDev, chain => {
      chain.add(path.resolve(__dirname, '../node_modules'))
    })
    .end()

  chain.resolve.alias
    .set('@', path.resolve(getCwd(), 'src'))
    .end()

  chain.module
    .rule('images')
    .test(/\.(jpe?g|png|svg|gif)(\?[a-z0-9=.]+)?$/)
    .use('url-loader')
    .loader(loadModule('url-loader'))
    .options({
      limit: 10000,
      name: '[name].[hash:8].[ext]',
      // require 图片的时候不用加 .default
      esModule: false,
      fallback: {
        loader: loadModule('file-loader'),
        options: {
          publicPath: '/client/images',
          name: '[name].[hash:8].[ext]',
          esModule: false,
          outputPath: 'images'
        }
      }
    })
    .end()

  chain.module
    .rule('vue')
    .test(/\.vue$/)
    .use('vue-loader')
    .loader(loadModule('vue-loader'))
    .options(vueLoaderOptions)
    .end()
  chain
    .plugin('vue-loader')
    .use(require('vue-loader').VueLoaderPlugin)
    .end()

  const babelModule = chain.module
    .rule('compile')
    .test(/\.(js|mjs|ts|tsx)$/)
    .exclude
    .add(/node_modules/)
    .end()

  const module = chain.module
    .rule('compileBabelForExtraModule')
    .test(/\.(js|mjs|jsx|ts|tsx)$/)
    .include
    .add([/vue/])
    .end()

  addBabelLoader(babelModule, {
    modules: false
  });
  addBabelLoader(module, {
    modules: false
  })

  setStyle(chain, /\.css$/, {
    rule: 'css',
    modules: true,
    importLoaders: 1
  });

  chain.module
    .rule('svg')
    .test(/\.(svg)(\?.*)?$/)
    .use('file-loader')
    .loader(loadModule('file-loader'))
    .options({
      name: 'static/[name].[hash:8].[ext]',
      esModule: false
    })
    .end()

  chain.module
    .rule('fonts')
    .test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
    .use('file-loader')
    .loader(loadModule('file-loader'))
    .options({
      name: 'static/[name].[hash:8].[ext]',
      esModule: false
    });

  chain.plugin('minify-css').use(MiniCssExtractPlugin, [{
    filename: !isDev ? 'static/css/[name].[contenthash:8].css' : 'static/css/[name].css',
    chunkFilename: !isDev ? 'static/css/[name].[contenthash:8].chunk.css' : 'static/css/[name].chunk.css'
  }]);

  chain.plugin('webpackBar').use(new WebpackBar({
    name: isServer ? 'server' : 'client',
    color: isServer ? '#f173ac' : '#45b97c'
  }));
}

module.exports = getBaseConfig;
