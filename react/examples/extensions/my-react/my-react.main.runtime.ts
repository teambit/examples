import { MainRuntime } from '@teambit/cli';
import { ReactAspect, ReactMain } from '@teambit/react';
import { EnvsAspect, EnvsMain } from '@teambit/envs';
import { PrintCmpNameTask } from '@teambit/pipelines.examples.modules.print-component-name';
import { MyReactAspect } from './my-react.aspect';
import {
  previewConfigTransformer,
  devServerConfigTransformer,
} from './webpack/webpack-transformers';

export class MyReactMain {
  static slots = [];

  static dependencies = [ReactAspect, EnvsAspect];

  static runtime = MainRuntime;

  static async provider([react, envs]: [ReactMain, EnvsMain]) {
    const templatesReactEnv = envs.compose(react.reactEnv, [
      react.useWebpack({
        previewConfig: [previewConfigTransformer],
        devServerConfig: [devServerConfigTransformer],
      }),
      react.overrideJestConfig(require.resolve('./jest/jest.config')),
      react.useTypescript({
        buildConfig: [
          (config) => {
            config.setTarget('ES2015');
            return config;
          },
        ],
        devConfig: [
          (config) => {
            config.setTarget('ES2017');
            return config;
          },
        ],
      }),
      react.useEslint({
        transformers: [
          (config) => {
            config.setRule('no-console', ['error']);
            return config;
          },
        ],
      }),
      react.usePrettier({
        transformers: [
          (config) => {
            config.setKey('tabWidth', 2);
            return config;
          },
        ],
      }),
      react.overrideDependencies({
        devDependencies: {
          '@types/react': '17.0.3',
        },
      }),
      react.overrideBuildPipe([
        new PrintCmpNameTask(
          'teambit.react/examples/extensions/my-react',
          'PrintCmpNameTask'
        ),
      ]),
      react.overridePackageJsonProps({
        'new-propery': 'value',
      }),
    ]);
    envs.registerEnv(templatesReactEnv);
    return new MyReactMain();
  }
}

MyReactAspect.addRuntime(MyReactMain);
