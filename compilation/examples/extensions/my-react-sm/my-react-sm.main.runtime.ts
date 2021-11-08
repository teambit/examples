import { MainRuntime } from '@teambit/cli';
import { ReactAspect, ReactMain } from '@teambit/react';
import { EnvsAspect, EnvsMain } from '@teambit/envs';
import {
  MyCompilerSMMain,
  MyCompilerSMAspect,
} from '@teambit/compilation.examples.extensions.my-compiler-sm';
import { MyReactSMAspect } from './my-react-sm.aspect';
import { MyReactSM } from './my-react-sm.env';

export class MyReactSMMain {
  constructor(readonly myReactEnv: MyReactSM) {}

  static dependencies = [ReactAspect, EnvsAspect, MyCompilerSMAspect];

  static runtime = MainRuntime;

  static async provider([react, envs, MyCompilerSM]: [
    ReactMain,
    EnvsMain,
    MyCompilerSMMain
  ]) {
    // Merge the customized and base Env instances
    const myReactEnv = envs.merge<MyReactSM>(
      react.reactEnv,
      new MyReactSM(MyCompilerSM)
    );

    // const templatesReactEnv = envs.compose(react.reactEnv, []);

    envs.registerEnv(myReactEnv);
    return new MyReactSMMain(myReactEnv);
  }
}

MyReactSMAspect.addRuntime(MyReactSMMain);
