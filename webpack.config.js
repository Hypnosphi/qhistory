const webpack = require('webpack')
const path = require('path')

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: './index.js',
  output: {
    library: 'qhistory',
    libraryTarget: 'umd'
  },
  externals: {
    history: {
      global: 'history',
      commonjs2: 'history',
      commonjs: 'history',
      amd: 'history'
    }
  },
  module: {
    rules: [
      { 
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}
