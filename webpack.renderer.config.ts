import type { Configuration } from 'webpack';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';

rules.push({
  test: /\.css$/,
  use: [
    'style-loader',
    { loader: 'css-loader' },
    { loader: 'postcss-loader' }
  ],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins: [
    ...plugins,
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      '@': path.resolve(process.cwd(), 'src/renderer'),
      '@main': path.resolve(process.cwd(), 'src/main'),
      '@shared': path.resolve(process.cwd(), 'src/shared'),
    },
    fallback: {
      // Provide browser-compatible stubs for Node.js modules
      events: require.resolve('events/'),
      util: require.resolve('util/'),
      assert: require.resolve('assert/'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      url: require.resolve('url/'),
    },
    // Enable ES modules support
    fullySpecified: false,
  },
  // Use web target and configure externals manually for better control
  target: 'web',
  externals: {
    // Only externalize electron - everything else should be bundled
    electron: 'commonjs2 electron',
  },
  devtool: 'source-map',
};
