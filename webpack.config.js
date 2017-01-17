const webpack = require('webpack');
const path = require('path');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/dev-server',
    './src/index',
  ],
  module: {
    loaders: [
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: 'url' },
      { test: /\.jsx?$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.css$/, loaders: ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader'] },
    ],
  },
  resolve: { extensions: ['', '.js', '.jsx'] },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './dist',
    hot: true,
  },
  plugins: [
    new WebpackNotifierPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('development') } }),
  ],
};
