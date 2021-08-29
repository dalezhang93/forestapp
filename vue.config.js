/* eslint-disable no-undef */
// vue.config.js
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [new CopyWebpackPlugin([
      {
        from: './node_modules/cesium/Build/Cesium', // 调试时，将Cesium换成CesiumUnminified
        to: 'js/Cesium',
        toType: 'dir'
      },
      {
        from: './node_modules/earthsdk/dist/XbsjCesium',
        to: 'js/earthsdk/XbsjCesium',
        toType: 'dir'
      },
      {
        from: './node_modules/earthsdk/dist/XbsjEarth',
        to: 'js/earthsdk/XbsjEarth',
        toType: 'dir'
      },
    ])]
  },
  devServer: {
    port: 8900,
    proxy: {
      '/api': {
        target: 'http://localhost:8080/',
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}