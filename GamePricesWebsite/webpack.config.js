const path = require('path');
module.exports = {
  entry: './static/js/index.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './static/js'),
  },
  devServer: {

    // Serve index.html as the base
    static:{
    directory: "/static/js/"},

    // Enable compression
    compress: true,

    // Enable hot reloading
    hot: true,


    port: 3000,

    // Public path is root of content base
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
},
};