import { MainRuntime } from '@teambit/cli';
import { ReactAspect, ReactMain } from '@teambit/react';
import { EnvsAspect, EnvsMain } from '@teambit/envs';
import {
  MyCompilerNoSmMain,
  MyCompilerNoSmAspect,
} from '@teambit/compilation.examples.extensions.my-compiler-no-sm';
import { MyReactNoSmAspect } from './my-react-no-sm.aspect';
import { MyReactNoSm } from './my-react-no-sm.env';
import { CompilerAspect, CompilerMain } from '@teambit/compiler';


export class MyReactNoSmMain {
  constructor(readonly myReactEnv: MyReactNoSm) {}

  static dependencies = [ReactAspect, EnvsAspect, MyCompilerNoSmAspect, CompilerAspect];

  static runtime = MainRuntime;

  static async provider([react, envs, myCompilerNoSM, compiler]: [
    ReactMain,
    EnvsMain,
    MyCompilerNoSmMain,
    CompilerMain
  ]) {
    // Merge the customized and base Env instances
    const myReactEnv = envs.merge<MyReactNoSm>(
      new MyReactNoSm(myCompilerNoSM),
      react.reactEnv,
    );

    envs.registerEnv(myReactEnv);
    return new MyReactNoSmMain(myReactEnv);
  }
}

MyReactNoSmAspect.addRuntime(MyReactNoSmMain);
