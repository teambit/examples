import { MainRuntime } from '@teambit/cli';
import { ReactAspect, ReactMain } from '@teambit/react';
import { EnvsAspect, EnvsMain } from '@teambit/envs';
import {
  BabelCompilerMain,
  BabelCompilerAspect,
} from '@teambit/compilation.examples.aspects.babel-compiler';
import { MyReactBabelAspect } from './my-react-babel.aspect';
import { MyReactBabel } from './my-react-babel.env';

export class MyReactBabelMain {
  constructor(readonly myReactEnv: MyReactBabel) {}
  static dependencies = [ReactAspect, EnvsAspect, BabelCompilerAspect];

  static runtime = MainRuntime;

  static async provider([react, envs, babelCompiler]: [
    ReactMain,
    EnvsMain,
    BabelCompilerMain
  ]) {
    // Merge the customized and base Env instances
    const myReactEnv = envs.merge<MyReactBabel, ReactMain>(
      new MyReactBabel(babelCompiler),
      react.reactEnv
    );
    envs.registerEnv(myReactEnv);
    return new MyReactBabelMain(myReactEnv);
  }
}

MyReactBabelAspect.addRuntime(MyReactBabelMain);
