const webpack = require('webpack');
const fs = require('fs')
const packageJson = fs.readFileSync('./package.json')
const version = JSON.parse(packageJson).version || 0

module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: process.env.NODE_ENV == 'production' ? false : true,
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
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE_VERSION: '"' + version + '"'
        },
      }),
    ],
  },
};
