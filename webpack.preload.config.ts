import type { Configuration } from 'webpack';
import { rules } from './webpack.rules';

export const preloadConfig: Configuration = {
  entry: './src/preload/index.ts',
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  target: 'electron-preload',
  devtool: 'source-map',
  externalsPresets: {
    electronPreload: false, // Disable automatic externalization for preload
    node: false,
  },
};
