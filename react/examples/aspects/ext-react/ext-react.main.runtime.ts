import { MainRuntime } from '@teambit/cli';
import { ReactAspect, ReactMain } from '@teambit/react';
import { EnvsAspect, EnvsMain } from '@teambit/envs';
import { BabelAspect, BabelMain } from '@teambit/babel';
import { CompilerAspect } from '@teambit/compiler';
import { babelConfig } from './babel/babel.config';
import { ExtReactAspect } from './ext-react.aspect';

export class ExtReactMain {
  static dependencies = [ReactAspect, EnvsAspect, BabelAspect];

  static runtime = MainRuntime;

  static async provider([react, envs, babel]: [
    ReactMain,
    EnvsMain,
    BabelMain
  ]) {
    const babelCompiler = babel.createCompiler({
      babelTransformOptions: babelConfig,
    });

    // Get React's build pipeline
    const basicBuildPipeline = react.reactEnv.getBuildPipe();
    // Filter out compilation build tasks
    const basicBuildPipelineWithoutCompilation = basicBuildPipeline.filter(
      (task) => task.aspectId !== CompilerAspect.id
    );
    // Depenencies to merge with React Env's dependnecies
    const dependencies = () => {
      return {
        devDependencies: {
          '@types/jest': '26.0.20',
        },
      };
    };

    const overrideObj = {
      getDependencies: () => dependencies,
      getCompiler: () => babelCompiler,
      getBuilder: () => [
        react.reactEnv.getBuildPipe,
        ...basicBuildPipelineWithoutCompilation,
      ],
    };

    const compilerTransformer = envs.override(overrideObj);
    const newEnv = react.compose([compilerTransformer]);
    envs.registerEnv(newEnv);
    return new ExtReactMain();
  }
}

ExtReactAspect.addRuntime(ExtReactMain);
