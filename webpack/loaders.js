// @flow

const app = require('about-this-app');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const hasBabelConfig = app.hasFile('.babelrc') || app.hasPkgProp('babel');
const presets = hasBabelConfig ? [] : require('../babel').presets;

exports.babel = {
  test: /\.(js|jsx|mjs)$/,
  include: app.dir('src'),
  exclude: /[/\\]node_modules[/\\]/,
  use: [
    // This loader parallelizes code compilation, it is optional but
    // improves compile time on larger projects
    require.resolve('thread-loader'),
    {
      loader: require.resolve('babel-loader'),
      options: {
        cacheDirectory: true,
        highlightCode: true,
        babelrc: hasBabelConfig,
        presets,
      },
    },
  ],
};

// Process any JS outside of the app with Babel.
// Unlike the application JS, we only compile the standard ES features.
exports.deps = {
  test: /\.js$/,
  use: [
    // This loader parallelizes code compilation, it is optional but
    // improves compile time on larger projects
    require.resolve('thread-loader'),
    {
      loader: require.resolve('babel-loader'),
      options: {
        babelrc: false,
        compact: false,
        presets: [require.resolve('babel-preset-cellular/dependencies')],
        cacheDirectory: true,
      },
    },
  ],
};

exports.css = {
  test: /\.css$/,
  use: [require.resolve('style-loader'), require.resolve('css-loader')],
};

exports.extractCss = {
  test: /\.css$/,
  use: ExtractTextPlugin.extract({
    fallback: require.resolve('style-loader'),
    use: {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 1,
        minimize: true,
      },
    },
  }),
};

// "file" loader makes sure those assets get served by WebpackDevServer.
// When you `import` an asset, you get its (virtual) filename.
// In production, they would get copied to the `build` folder.
// This loader doesn't use a "test" so it will catch all modules
// that fall through the other loaders.
exports.file = {
  // Exclude `js` files to keep "css" loader working as it injects
  // it's runtime that would otherwise be processed through "file" loader.
  // Also exclude `html` and `json` extensions so they get processed
  // by webpacks internal loaders.
  exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
  loader: require.resolve('file-loader'),
  options: {
    name: 'assets/[name].[hash:8].[ext]',
  },
};
