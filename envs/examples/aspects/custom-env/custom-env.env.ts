import { CompilerEnv, BuilderEnv, DependenciesEnv } from '@teambit/envs';
import { CompilerMain } from '@teambit/compiler';
import { BabelMain } from '@teambit/babel';
import { babelConfig } from './babel/babel.config';

export const AspectEnvType = 'custom-env';

export class CustomEnv implements CompilerEnv, BuilderEnv, DependenciesEnv {
  constructor(private compiler: CompilerMain, private babel: BabelMain) {}
  // Use the 'getCompiler' service handler to use a compiler for compilation in the workspace (during development)
  getCompiler() {
    const babelCompiler = this.babel.createCompiler({
      babelTransformOptions: babelConfig,
    });
    return babelCompiler;
  }

  // Use the 'getBuildPipe' service handler to register a build task
  // Here, we register:
  // 1. Babel for compilation during build (this is done by using the Compiler aspect API)
  getBuildPipe() {
    const babelCompiler = this.babel.createCompiler({
      babelTransformOptions: babelConfig,
    });
    return [this.compiler.createTask('BabelCompiler', babelCompiler)];
  }

  getDependencies() {
    return {
      dependencies: {
        react: '-',
        'react-dom': '-',
        'core-js': '^3.0.0',
      },

      devDependencies: {
        react: '-',
        'react-dom': '-',
        '@types/mocha': '-',
        '@types/node': '12.20.4',
        '@types/react': '^17.0.8',
        '@types/react-dom': '^17.0.5',
        '@babel/runtime': '7.12.18',
        '@babel/plugin-proposal-class-properties': '7.16.0',
        '@babel/preset-env': '7.16.4',
        '@babel/preset-react': '7.16.0',
        '@babel/preset-typescript': '7.16.0',
      },
      peerDependencies: {
        react: '^16.8.0 || ^17.0.0',
        'react-dom': '^16.8.0 || ^17.0.0',
      },
    };
  }
  async __getDescriptor() {
    return {
      type: AspectEnvType,
    };
  }
}
