import { BuilderEnv } from '@teambit/envs';
import { ReactEnv } from '@teambit/react';
import { LocStats } from '@teambit/pipelines.examples.modules.loc-stats';
import { ReactLocStatsAspect } from './react-loc-stats.aspect';

// The Env class should only implement the services it overrides
export class ReactLocStats implements BuilderEnv {
  constructor(private reactEnv: ReactEnv) {}

  getBuildPipe() {
    return [
      ...this.reactEnv.getBuildPipe(),
      new LocStats(ReactLocStatsAspect.id),
    ];
  }
}
