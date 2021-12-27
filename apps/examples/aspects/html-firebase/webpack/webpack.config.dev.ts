import path from 'path';
import { Configuration } from 'webpack';
import { ComponentID } from '@teambit/component-id';

// eslint-disable-next-line complexity
export default function (workDir: string): Configuration {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          // limit loader to files in the current project,
          // to skip any files linked from other projects (like Bit itself)
          include: path.join(workDir, 'node_modules'),
          // only apply to packages with componentId in their package.json (ie. Components)
          descriptionData: { componentId: (value) => !!value },
          use: [require.resolve('source-map-loader')],
        },
        {
          test: /\.js$/,
          // limit loader to files in the current project,
          // to skip any files linked from other projects (like Bit itself)
          include: path.join(workDir, 'node_modules'),
          // only apply to packages with componentId in their package.json (ie. Components)
          descriptionData: { componentId: ComponentID.isValidObject },
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                // turn off all optimizations (only slow down for node_modules)
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
