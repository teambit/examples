import { Configuration } from 'webpack';

export const webpackConfig: any = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
