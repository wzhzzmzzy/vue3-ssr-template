const setStyle = (chain, reg, options) => {
  const { include, exclude, modules, importLoaders, loader } = options
  const MiniCssExtractPlugin = require('mini-css-extract-plugin')
  const loadModule = require.resolve
  const isDev = process.env.NODE_ENV !== 'production'

  const cssloaderOptions = {
    importLoaders: importLoaders,
    modules: modules,
  }

  const postcssOptions = {
    ident: 'postcss',
    plugins: [
      'postcss-flexbugs-fixes',
      'postcss-discard-comments',
      [
        'postcss-preset-env',
        {
          autoprefixer: {
            flexbox: 'no-2009'
          },
          stage: 3
        }
      ]
    ],
  }

  chain.module
    .rule(options.rule)
    .test(reg)
    .when(Boolean(include), rule => {
      include && rule.include.add(include).end()
    })
    .when(Boolean(exclude), rule => {
      exclude && rule.exclude.add(exclude).end()
    })
    .use('MiniCss')
    .loader(MiniCssExtractPlugin.loader)
    .end()
    .use('css-loader')
    .loader(loadModule('css-loader'))
    .options(cssloaderOptions)
    .end()
    .use('postcss-loader')
    .loader(loadModule('postcss-loader'))
    .options({
      postcssOptions
    })
    .end()
    .when(Boolean(loader), rule => {
      loader && rule.use(loader)
        .loader(loadModule(loader))
        .end()
    })
}

module.exports = setStyle;
