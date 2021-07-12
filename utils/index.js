const axios = require('axios');
const path = require('path');
const config = require('../config');

let manifest = {};

const getCwd = () => {
  return path.resolve(process.cwd(), process.env.APP_ROOT || '')
}

const getManifestFile = async () => {
  const { isDev, devPort } = config;

  if (Object.keys(manifest).length !== 0) {
    return
  }
  const cwd = getCwd()
  if (isDev) {
    const res = await axios.get(`http://localhost:${devPort}/asset-manifest.json`)
    manifest = res.data
  } else {
    manifest = require(path.join(cwd, './build/client/asset-manifest.json'))
  }
}

const getManifest = async () => {
  await getManifestFile();
  return manifest
}

module.exports = {
  getCwd,
  getManifest
}
