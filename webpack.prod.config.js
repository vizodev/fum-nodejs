'use strict';

let webpack = require('webpack');
let path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader')
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: ['./src/index.ts'],
  mode: 'production',

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
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new TerserPlugin()
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