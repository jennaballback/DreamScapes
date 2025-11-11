// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Let Metro treat CommonJS bundles as assets (Firebase ships some .cjs)
config.resolver.assetExts.push("cjs");

// Disable package export resolution that can confuse Firebase subpaths
config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: './app/global.css' })