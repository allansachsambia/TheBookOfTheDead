const webpack = require("webpack");
var path = require("path");

module.exports = {
  entry: {
    app: "./index.js"
  },
  module: {
    rules: [
      { test: /\.(jpe?g|png|gif|svg)$/i, loader: "url-loader" },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "postcss-loader"]
      }
    ]
  },
  output: {
    filename: "bundle.js",
    publicPath: "/"
  },
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    historyApiFallback: true,
    disableHostCheck: true,
    port: 8000,
    host: "0.0.0.0"
  },
  context: path.resolve(__dirname, "src"),
  mode: "development"
};
