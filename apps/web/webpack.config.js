const path = require('node:path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const stringify = require('safe-stable-stringify');

const webpack = require('webpack');

const glob = require('glob');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  const htmlPages = glob.sync('./src/pages/**/**/*.html');

  const htmlPlugins = htmlPages.map(
    (filePath) =>
      new HtmlWebpackPlugin({
        template: filePath,
        filename: path.relative('./src/pages', filePath),
        chunks: ['main'],
        inject: true
      })
  );

  // Add this line after the htmlPlugins definition
  const indexHtmlPlugin = new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html',
    chunks: ['main'],
    inject: true
  });

  return {
    entry: './src/app.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].css'
      }),
      indexHtmlPlugin,
      ...htmlPlugins,
      new CopyWebpackPlugin({
        patterns: [{ from: 'public/icons', to: 'icons' }]
      }),
      new webpack.DefinePlugin({
        'process.env.API_BASE_URL': stringify(
          isProduction
            ? 'https://travel-destinations-api.vercel.app/api/v1'
            : 'http://localhost:3000/api/v1'
        )
      })
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
        publicPath: '/'
      },
      compress: true,
      port: 8080,
      hot: true,
      historyApiFallback: true
    },
    mode: isProduction ? 'production' : 'development'
  };
};
