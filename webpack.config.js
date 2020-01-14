const path = require('path');
const webpack = require('webpack');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const ignorePlugin = new webpack.IgnorePlugin({
  checkResource(resource) {
    const lazyImports = [
      '@nestjs/microservices',
      // ADD THIS
      '@nestjs/microservices/microservices-module',
      '@nestjs/websockets',
      // AND THIS
      '@nestjs/websockets/socket-module',
      // '@nestjs/platform-express',
      'cache-manager',
      'class-validator',
      'class-transformer',
      'pg-native',
    ];

    if (!lazyImports.includes(resource)) {
      return false;
    }
    try {
      require.resolve(resource);
    } catch (err) {
      return true;
    }
    return false;
  },
});


module.exports = {
  // externals: [nodeExternals()],
  devtool: 'source-map',
  entry: slsw.lib.entries,
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
    plugins: [
      new TsconfigPathsPlugin()
    ]
  },
  target: 'node',
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      use: [{
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      }]
    }]
  },
  plugins: [ignorePlugin],
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  stats: 'minimal', // errors-only, minimal, none, normal, verbose
  output: {
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, '.webpack'),
    filename: '[name].js'
  },
  optimization: {
    minimize: false
  },
};
