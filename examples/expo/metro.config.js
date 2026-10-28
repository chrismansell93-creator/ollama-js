const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)
// Needed so Metro resolves the "ollama/browser" subpath export
config.resolver.unstable_enablePackageExports = true

module.exports = config
