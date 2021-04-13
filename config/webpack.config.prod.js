const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: ['./src/web/index.js'],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    filename: '[name].[hash].js',
    path: __dirname + '/../dist',
    publicPath: '/admin',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new Dotenv(),
    new webpack.DefinePlugin({
      'process.env.FIREBASE_API_KEY': JSON.stringify(
        process.env.FIREBASE_API_KEY,
      ),
      'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(
        process.env.FIREBASE_AUTH_DOMAIN,
      ),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(
        process.env.FIREBASE_PROJECT_ID,
      ),
      'process.env.FIREBASE_APP_ID': JSON.stringify(
        process.env.FIREBASE_APP_ID,
      ),
    }),
  ],
};
