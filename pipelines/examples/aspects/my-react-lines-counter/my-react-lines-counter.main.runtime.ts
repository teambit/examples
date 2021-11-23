import { MainRuntime } from '@teambit/cli';
import { ReactAspect, ReactMain } from '@teambit/react';
import { EnvsAspect, EnvsMain } from '@teambit/envs';
import { MyReactLinesCounterAspect } from './my-react-lines-counter.aspect';
import { MyReactLinesCounter } from './my-react-lines-counter.env';

export class MyReactLinesCounterMain {
  constructor(readonly myReactEnv: MyReactLinesCounter) {}
  static dependencies = [ReactAspect, EnvsAspect];

  static runtime = MainRuntime;

  static async provider([react, envs]: [ReactMain, EnvsMain]) {
    // Merge the customized and base Env instances
    const myReactEnv = envs.merge<MyReactLinesCounter>(
      new MyReactLinesCounter(react.reactEnv),
      react.reactEnv
    );
    envs.registerEnv(myReactEnv);
    return new MyReactLinesCounterMain(myReactEnv);
  }
}

MyReactLinesCounterAspect.addRuntime(MyReactLinesCounterMain);
