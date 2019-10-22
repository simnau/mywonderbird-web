const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    './src/web/index.js',
  ],
  module: {
    rules: [{
      test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
    }],
  },
  output: {
    filename: '[name][hash].js',
    path: __dirname + '/../dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
};
