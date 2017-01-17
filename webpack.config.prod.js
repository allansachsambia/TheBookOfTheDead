var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './src/index',
  module: {
    loaders: [
      { test: /\.(jpe?g|png|gif|svg)$/i, loader:'url'},
      { test: /\.jsx?$/, loader: 'babel', exclude: /node_modules/ },
      { test: /\.css$/, loaders: [ 'style-loader', 'css-loader?importLoaders=1', 'postcss-loader' ] }
    ]
  },
  resolve: { extensions: ['', '.js', '.jsx'] },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    inline: true,
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': JSON.stringify('production') } }),
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
  ]
};
