import { MainRuntime } from '@teambit/cli';
import { ReactAspect, ReactMain } from '@teambit/react';
import { EnvsAspect, EnvsMain } from '@teambit/envs';
import {
  MyCompilerNoSmMain,
  MyCompilerNoSmAspect,
} from '@teambit/compilation.examples.extensions.my-compiler-no-sm';
import { MyReactMAspect } from './my-react-m.aspect';
import { MyReactM } from './my-react-m.env';

export class MyReactNoSmMain {
  constructor(readonly myReactEnv: MyReactM) {}

  static dependencies = [ReactAspect, EnvsAspect, MyCompilerNoSmAspect];

  static runtime = MainRuntime;

  static async provider([react, envs, myCompilerSM]: [
    ReactMain,
    EnvsMain,
    MyCompilerNoSmMain
  ]) {
    // Merge the customized and base Env instances
    const myReactEnv = envs.merge<MyReactM>(
      react.reactEnv,
      new MyReactM(myCompilerSM)
    );

    envs.registerEnv(myReactEnv);
    return new MyReactNoSmMain(myReactEnv);
  }
}

MyReactMAspect.addRuntime(MyReactNoSmMain);
