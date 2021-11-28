import { MainRuntime } from '@teambit/cli';
import { GraphqlMain, GraphqlAspect } from '@teambit/graphql';
import { BuilderMain, BuilderAspect } from '@teambit/builder';
import { ScopeMain, ScopeAspect } from '@teambit/scope';
import { LocStats } from '@teambit/pipelines.examples.modules.loc-stats';
import { locStatsSchema } from './aspect-loc-stats.graphql';
import { AspectLocStatsAspect } from './aspect-loc-stats.aspect';

export class AspectLocStatsMain {
  static dependencies = [ScopeAspect, BuilderAspect, GraphqlAspect];
  static runtime = MainRuntime;
  static async provider([scope, builder, graphql]: [
    ScopeMain,
    BuilderMain,
    GraphqlMain
  ]) {
    // @ts-ignore
    builder.registerBuildTasks([new LocStats(AspectLocStatsAspect.id)]);
    // @ts-ignore
    graphql.register(locStatsSchema(builder));
    return new AspectLocStatsMain();
  }
}

AspectLocStatsAspect.addRuntime(AspectLocStatsMain);
