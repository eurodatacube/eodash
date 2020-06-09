const webpack = require('webpack');
const fs = require('fs');

const packageJson = fs.readFileSync('./package.json');
const version = JSON.parse(packageJson).version || 0;
const RemoveServiceWorkerPlugin = require('webpack-remove-serviceworker-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;


module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: process.env.NODE_ENV !== 'production',
  transpileDependencies: [
    'vuetify',
  ],
  configureWebpack: {
    module: {
      rules: [{
        test: /\.md$/,
        loader: 'raw-loader',
      }],
    },
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 50,
        minSize: 10000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
              return `${packageName.replace('@', '')}`;
            },
          },
        },
      },
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.HashedModuleIdsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE_VERSION: '"' + version + '"'
        },
      }),
      new RemoveServiceWorkerPlugin({ filename: 'service-worker.js' }),
      new ImageminPlugin({
        disable: process.env.NODE_ENV !== 'production',
      }),
    ],
  },
};
