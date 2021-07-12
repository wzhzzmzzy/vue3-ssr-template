const loadModule = require.resolve

const addBabelLoader = (chain, envOptions) => {
  chain.use('babel-loader')
    .loader(loadModule('babel-loader'))
    .options({
      cacheDirectory: true,
      cacheCompression: false,
      sourceType: 'unambiguous',
      presets: [
        [
          loadModule('@babel/preset-env'),
          envOptions
        ]
      ],
      plugins: [
        [
          loadModule('@babel/plugin-transform-runtime'),
          {
            corejs: false
          }
        ],
        loadModule('@vue/babel-plugin-jsx')
      ]
    })
    .end()
}

module.exports = addBabelLoader;
