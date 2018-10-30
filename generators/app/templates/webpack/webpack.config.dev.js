const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const webpackConfigBase = require('./webpack.config.base.js')

const config = Object.assign(webpackConfigBase.config, {
  mode: 'development',
  // sourcemap 模式
  devtool: 'eval-source-map', // 定位会有问题，还是用eval-source-map好了
  // 入口
  entry: {
    app: [ webpackConfigBase.resolve('src/index.js') ]
  },
  // 输出
  output: {
    path: webpackConfigBase.resolve('dev'),
    filename: '[name].js',
    globalObject: 'this'
  },
  plugins: [
    // make sure to include the plugin for the magic
    webpackConfigBase.VueLoaderPluginInstance,
    // html 模板插件
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: webpackConfigBase.resolve('src/index.html')
    }),
    // 热替换插件
    new webpack.HotModuleReplacementPlugin(),
    // 更友好地输出错误信息
    new FriendlyErrorsPlugin(),
    // 提示信息
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.ProgressPlugin()
  ]
})

module.exports = config