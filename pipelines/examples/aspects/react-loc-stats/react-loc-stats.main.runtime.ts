import { MainRuntime } from '@teambit/cli';
import { ReactAspect, ReactMain } from '@teambit/react';
import { EnvsAspect, EnvsMain } from '@teambit/envs';
import { ReactLocStatsAspect } from './react-loc-stats.aspect';
import { ReactLocStats } from './react-loc-stats.env';

export class ReactLocStatsMain {
  constructor(readonly myReactEnv: ReactLocStats) {}
  static dependencies = [ReactAspect, EnvsAspect];

  static runtime = MainRuntime;

  static async provider([react, envs]: [ReactMain, EnvsMain]) {
    // Merge the customized and base Env instances
    const myReactEnv = envs.merge<ReactLocStats>(
      new ReactLocStats(react.reactEnv),
      react.reactEnv
    );
    envs.registerEnv(myReactEnv);
    return new ReactLocStatsMain(myReactEnv);
  }
}

ReactLocStatsAspect.addRuntime(ReactLocStatsMain);
