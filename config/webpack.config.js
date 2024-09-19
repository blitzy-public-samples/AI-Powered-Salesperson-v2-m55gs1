const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const env = require('@/config/env');

module.exports = (env, argv) => {
  // Determine if the build is for production
  const isProduction = argv.mode === 'production';

  return {
    // Configure entry points
    entry: {
      main: './src/frontend/index.tsx',
    },

    // Configure output settings
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: 'js/[name].[contenthash].js',
      publicPath: '/',
    },

    // Set up module rules for different file types
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: 'file-loader',
        },
      ],
    },

    // Configure plugins
    plugins: [
      new HtmlWebpackPlugin({ template: './src/frontend/index.html' }),
      new MiniCssExtractPlugin({ filename: 'css/[name].[contenthash].css' }),
      new webpack.DefinePlugin({ 'process.env': JSON.stringify(env) }),
    ],

    // Set up optimization for production builds
    optimization: {
      minimizer: isProduction ? [new TerserPlugin(), new OptimizeCSSAssetsPlugin()] : [],
      splitChunks: {
        chunks: 'all',
      },
    },

    // Configure resolve options
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
        '@': path.resolve(__dirname, '../src'),
      },
    },

    // Set up dev server options for development
    devServer: {
      contentBase: path.join(__dirname, '../dist'),
      compress: true,
      port: 3000,
      historyApiFallback: true,
      hot: true,
    },
  };
};