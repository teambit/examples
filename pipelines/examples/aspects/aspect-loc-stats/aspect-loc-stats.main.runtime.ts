import { MainRuntime } from '@teambit/cli';
import { BuilderMain, BuilderAspect } from '@teambit/builder';
import { LocStats } from '@teambit/pipelines.examples.modules.loc-stats';
import { AspectLocStatsAspect } from './aspect-loc-stats.aspect';

export class AspectLocStatsMain {
  static dependencies = [BuilderAspect];
  static runtime = MainRuntime;
  static async provider([builder]: [BuilderMain]) {
    builder.registerBuildTasks([new LocStats(AspectLocStatsAspect.id)]);
    return new AspectLocStatsMain();
  }
}

AspectLocStatsAspect.addRuntime(AspectLocStatsMain);
