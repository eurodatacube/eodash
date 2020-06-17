const webpack = require('webpack');
const fs = require('fs')
const packageJson = fs.readFileSync('./package.json')
const version = JSON.parse(packageJson).version || 0
const RemoveServiceWorkerPlugin = require('webpack-remove-serviceworker-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const appConfig = require('./src/appConfig')

const pages = {}
appConfig.map((b) => {
  pages[b.id] = {
    entry: './src/main.js',
    template: 'public/index.html',
    filename: b.id === 'esa' ? 'index.html' : `index-${b.id}.html`,
    chunks: ['chunk-vendors', 'chunk-common', b.id],
    title: b.branding.appName,
    favicon: b.branding.faviconPath,
    meta: {
      'google-site-verification': b.pageMeta.googleSiteVerification,
      // Twitter Card
      'twitter:card': 'summary_large_image',
      'twitter:description': b.pageMeta.shortDescription,
      'twitter:title': b.branding.appName,
      'twitter:image': `${b.pageMeta.rootPath}${b.pageMeta.twitterCardImagePath}`,
      // Facebook OpenGraph
      'og:title': { property: 'og:title', content: b.branding.appName },
      'og:site_name': { property: 'og:site_name', content:b.branding.appName },
      'og:type': { property: 'og:type', content: 'website' },
      'og:image': { property: 'og:image', content: `${b.pageMeta.rootPath}${b.pageMeta.twitterCardImagePath}` },
      'og:description': { property: 'og:description', content: b.pageMeta.shortDescription },
      // Colored status bar
      // Chrome, Firefox OS and Opera
      'theme-color': { property: 'theme-color', content: b.branding.primaryColor },
      // Windows Phone
      'msapplication-navbutton-color': { property: 'msapplication-navbutton-color', content: b.branding.primaryColor },
      // iOS Safari
      'apple-mobile-web-app-status-bar-style': { property: 'apple-mobile-web-app-status-bar-style', content: b.branding.primaryColor },
    },
  }
})

module.exports = {
  pages,
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
