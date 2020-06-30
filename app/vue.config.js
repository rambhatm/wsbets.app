const webpack = require('webpack');

module.exports = {
  lintOnSave: false,
  configureWebpack: {

    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 6
      })
    ]
  },
  /*
  pwa: {
    name: 'Vue Black Dashboard',
    themeColor: '#344675',
    msTileColor: '#344675',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: '#344675'
  },
  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: false
    }
  },
  css: {
    // Enable CSS source maps.
    sourceMap: process.env.NODE_ENV !== 'production'
  },*/
  devServer: {
    proxy: {
      "^/api": {
        target: 'http://localhost:3000/',
        ws: true,
        changeOrigin: true
      }
    }
  }


};