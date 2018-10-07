var webpack = require("webpack");
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
    publicPath: "/public"
  },
  devServer: {
    contentBase: path.resolve(__dirname, "public"),
    historyApiFallback: true,
    disableHostCheck: true,
    inline: true,
    hot: true
  },
  context: path.resolve(__dirname, "src"),
  mode: "production"
};
