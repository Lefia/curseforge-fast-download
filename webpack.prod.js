import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import ZipPlugin from 'zip-webpack-plugin';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: 'production',
  entry: {
    content: './src/content/content.js',
    background: './src/background/background.js',
    popup: './src/popup/index.jsx',
    options: './src/options/index.jsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(css|scss)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
          emit: true,
        },
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss', '.jpg', '.png', '.gif', '.jpeg'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@popup': path.resolve(__dirname, 'src', 'popup'),
      '@options': path.resolve(__dirname, 'src', 'options'),
      '@assets': path.resolve(__dirname, 'src', 'assets'),
      '@images': path.resolve(__dirname, 'src', 'assets', 'images'),
      '@data': path.resolve(__dirname, 'src', 'assets', 'data'),
      '@styles': path.resolve(__dirname, 'src', 'assets', 'styles'),
    },
  },
  optimization: {
    minimizer: [new TerserPlugin()],
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/i,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'popup', 'index.html'),
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'options', 'index.html'),
      filename: 'options.html',
      chunks: ['options'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/assets/images', to: 'images' },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new ZipPlugin({
      filename: 'cfd.zip',
    }),
  ],
};
