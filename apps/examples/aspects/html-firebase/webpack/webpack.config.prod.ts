import { Configuration } from 'webpack';
import { ComponentID } from '@teambit/component-id';

// eslint-disable-next-line complexity
export default function (): Configuration {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [/node_modules/, /\/dist\//],
          exclude: /@teambit\/legacy/,
          descriptionData: { componentId: ComponentID.isValidObject },
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                plugins: [],
                compact: false,
                minified: false,
              },
            },
          ],
        },
      ],
    },
  };
}
