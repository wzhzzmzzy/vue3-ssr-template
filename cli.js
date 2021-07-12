const yargs = require('yargs');
const WebpackChain = require('webpack-chain');
const createServer = require('./server');

yargs.command('dev', 'start dev server', {}, async (argv) => {
  process.env.NODE_ENV = 'development'
  const { startServerBuild, startClientServer } = require('./webpack/entry');
  const getClientWebpack = require('./webpack/client');
  const getServerWebpack = require('./webpack/server');
  const clientConfigChain = new WebpackChain();
  const serverConfigChain = new WebpackChain();
  await Promise.all([
    startServerBuild(getServerWebpack(serverConfigChain)),
    startClientServer(getClientWebpack(clientConfigChain))
  ])
  createServer();
}).command('build', 'start build', {}, async (argv) => {
  process.env.NODE_ENV = 'production'
  const { startServerBuild, startClientBuild } = require('./webpack/entry');
  const getClientWebpack = require('./webpack/client');
  const getServerWebpack = require('./webpack/server');
  const clientConfigChain = new WebpackChain();
  const serverConfigChain = new WebpackChain();
  await Promise.all([
    startServerBuild(getServerWebpack(serverConfigChain)),
    startClientBuild(getClientWebpack(clientConfigChain))
  ])
}).command('start', 'start server', {}, () => {
  createServer();
}).parse();
