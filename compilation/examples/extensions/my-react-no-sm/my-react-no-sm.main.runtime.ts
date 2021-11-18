import { MainRuntime } from '@teambit/cli';
import { ReactAspect, ReactMain } from '@teambit/react';
import { EnvsAspect, EnvsMain } from '@teambit/envs';
import {
  BabelCompilerMain,
  BabelCompilerAspect,
} from '@teambit/compilation.examples.extensions.babel-compiler';
import { MyReactNoSmAspect } from './my-react-no-sm.aspect';
import { MyReactNoSm } from './my-react-no-sm.env';

export class MyReactNoSmMain {
  constructor(readonly myReactEnv: MyReactNoSm) {}
  static dependencies = [ReactAspect, EnvsAspect, BabelCompilerAspect];

  static runtime = MainRuntime;

  static async provider([react, envs, babelCompiler]: [
    ReactMain,
    EnvsMain,
    BabelCompilerMain
  ]) {
    // Merge the customized and base Env instances
    const myReactEnv = envs.merge<MyReactNoSm>(
      new MyReactNoSm(babelCompiler),
      react.reactEnv
    );
    envs.registerEnv(myReactEnv);
    return new MyReactNoSmMain(myReactEnv);
  }
}

MyReactNoSmAspect.addRuntime(MyReactNoSmMain);
