const nodeExternals = require('webpack-node-externals')
const path = require('path')
const paths = require('./paths');

module.exports = {
  name: 'server',
  entry: paths.serverIndexJs,
  mode: 'production',
  output: {
    path: paths.serverBuild,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx'],
  },
  externals: [nodeExternals()],
  target: 'node',
  node: {
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          configFile: paths.serverTsSrc,
        },
      },
    ],
  },
}
