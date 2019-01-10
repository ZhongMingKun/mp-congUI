const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

const isDev = process.argv.indexOf('--develop') >= 0
const isWatch = process.argv.indexOf('--watch') >= 0
const demoSrc = path.resolve(__dirname, './demo')
const demoDist = path.resolve(__dirname, '../miniprogram_dev')
const src = path.resolve(__dirname, '../src')
const dev = path.join(demoDist, 'dist')
const dist = path.resolve(__dirname, '../miniprogram_dist')
const entry = fs.readdirSync(`${src}/components`).map(item => `components/${item}/index`)

module.exports = {
  entry,

  isDev,
  isWatch,
  srcPath: src,
  distPath: isDev ? dev : dist,

  demoSrc,
  demoDist,

  wxss: {
    less: false, // compile wxss with less
    sourcemap: false, // source map for less
  },

  webpack: {
    mode: 'production',
    output: {
      filename: '[name].js',
      libraryTarget: 'commonjs2'
    },
    target: 'node',
    externals: [nodeExternals()], // ignore node_modules
    module: {
      rules: [{
        test: /\.js$/i,
        use: [
          'babel-loader',
          // 'eslint-loader'
        ],
        exclude: /node_modules/
      }],
    },
    resolve: {
      modules: [src, 'node_modules'],
      extensions: ['.js', '.json'],
    },
    plugins: [
      new webpack.DefinePlugin({}),
      new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1}),
    ],
    optimization: {
      minimize: false,
    },
    // devtool: 'nosources-source-map', // source map for js
    performance: {
      hints: 'warning',
      assetFilter: assetFilename => assetFilename.endsWith('.js')
    }
  },

  copy: ['./wxml', './wxss', './wxs', './images'], // will copy to dist
}
