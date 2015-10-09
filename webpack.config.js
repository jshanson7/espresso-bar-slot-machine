const assign = require('lodash/object/assign');
const path = require('path');
const webpack = require('webpack');
const functions = require('postcss-functions');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const calc = require('postcss-calc');
const csswring = require('csswring');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('./config');
const publicPath = '/' + config.outputDir + '/';

const eslint = {
  test: /\.jsx?$/,
  loader: 'eslint-loader',
  include: path.join(__dirname, config.inputDir)
};

const cssLoader = {
  test: /\.css$/,
  loader: ExtractTextPlugin.extract('style-loader', ['css-loader', 'postcss-loader?parser=postcss-scss', 'cssnext-loader'].join('!')),
  include: path.join(__dirname, config.inputDir)
};

const imageLoader = {
  test: /\.(jpe?g|png|gif|svg)$/i,
  loaders: [
    'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, svgo:{datauri: true}}'
  ]
};

const common = {
  output: {
    path: path.join(__dirname, config.outputDir),
    filename: config.outputFile + '.js',
    publicPath: publicPath
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.css']
  },
  postcss: [
    functions({ functions: { em: pxVal => `${pxVal / 16}em` } }),
    precss,
    require('postcss-nested'),
    autoprefixer,
    calc,
    csswring
  ],
  stats: { colors: true }
};

const development = assign({}, common, {
  devtool: 'eval-source-map',
  entry: [
    'webpack-dev-server/client?http://' + config.host + ':' + config.port,
    'webpack/hot/only-dev-server',
    config.entry
  ],
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin(config.outputFile + '.css')
  ],
  module: {
    preLoaders: [eslint],
    loaders: [
      cssLoader,
      {
        test: /\.jsx?$/,
        loaders: ['source-map-loader', 'react-hot', 'babel'],
        include: path.join(__dirname, config.inputDir)
      },
      imageLoader
    ]
  },
  devServer: {
    publicPath: publicPath,
    hot: true
  }
});

const production = assign({}, common, {
  entry: [config.entry],
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({ output: { comments: false } }),
    new ExtractTextPlugin(config.outputFile + '.css')
  ],
  module: {
    preLoaders: [eslint],
    loaders: [
      cssLoader,
      {
        test: /\.jsx?$/,
        loader: 'babel',
        include: path.join(__dirname, config.inputDir)
      },
      imageLoader
    ]
  }
});

module.exports = { development: development, production: production }[config.env];
