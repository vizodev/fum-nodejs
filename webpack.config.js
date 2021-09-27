'use strict';

const path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
  entry: ['./src/index.ts'],
  mode: 'development',
  optimization: {
      usedExports: true,
  },

  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[name].bundle.js'
  },

  module: {
    rules: [
      { test: /\.ts$/, loader: 'awesome-typescript-loader' }
    ]
  },

  plugins: [
    new CheckerPlugin(),
  ],

  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'app')
    ],
    extensions: ['.ts', '.js']
  },

  devtool: false
};