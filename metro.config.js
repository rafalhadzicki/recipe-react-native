/* eslint-disable no-undef */
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      assetPlugins: ['expo-asset/tools/hashAssetFiles'],
      unstable_allowRequireContext: true
    },
    resolver: {
      assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...defaultConfig.resolver.sourceExts, 'svg']
    }
  };
})();
