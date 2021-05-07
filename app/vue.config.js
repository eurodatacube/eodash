const webpack = require('webpack'); // eslint-disable-line
const fs = require('fs');

const packageJson = fs.readFileSync('./package.json');
const version = JSON.parse(packageJson).version || 0;
const RemoveServiceWorkerPlugin = require('webpack-remove-serviceworker-plugin');
const appConfig = require('./src/appConfig');

const pages = {};
appConfig.map((b) => { // eslint-disable-line
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
      'og:site_name': { property: 'og:site_name', content: b.branding.appName },
      'og:type': { property: 'og:type', content: 'website' },
      'og:image': { property: 'og:image', content: `${b.pageMeta.rootPath}${b.pageMeta.twitterCardImagePath}` },
      'og:description': { property: 'og:description', content: b.pageMeta.shortDescription },
      // Colored status bar
      // Chrome, Firefox OS and Opera
      'theme-color': b.branding.primaryColor,
      // Windows Phone
      'msapplication-navbutton-color': b.branding.primaryColor,
      // iOS Safari
      'apple-mobile-web-app-status-bar-style': b.branding.primaryColor,
      // Favicon related stuff
      'application-name': b.branding.appName,
      'msapplication-TileColor': b.branding.primaryColor,
      'msapplication-TileImage': `${b.pageMeta.imagePath}/mstile-144x144.png`,
    },
  };
});


module.exports = {
  pages,
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: process.env.NODE_ENV !== 'production',
  // publicPath: '/', // enabled for feature branch deployment
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
    externals: {
      moment: 'moment',
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.HashedModuleIdsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          PACKAGE_VERSION: `"${version}"`,
        },
      }),
      new RemoveServiceWorkerPlugin({ filename: 'service-worker.js' }),
    ],
  },
};
