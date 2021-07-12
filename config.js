function getConfig () {
  const chunkName = 'Demo';
  const isDev = process.env.NODE_ENV !== 'production'
  const faviconPath = 'assets/favicon.ico';

  return {
    isDev,
    faviconPath,
    serverPort: 8000,
    devPort: 8080,
    publicPath: '/',
    chunkName,
    cssOrder: [`${chunkName}.css`],
    jsOrder: [`runtime~${chunkName}.js`, 'vendor.js', `${chunkName}.js`],
  }
}

module.exports = getConfig();
