import { MainRuntime } from '@teambit/cli';
import { GraphqlMain, GraphqlAspect } from '@teambit/graphql';
import { BuilderMain, BuilderAspect } from '@teambit/builder';
import { ScopeMain, ScopeAspect } from '@teambit/scope';
import { LocStats } from '@teambit/pipelines.examples.modules.loc-stats';
import { ComponentAspect, ComponentMain } from '@teambit/component';
import { locStatsSchema } from './loc-stats.graphql';
import { LocStatsAspect } from './loc-stats.aspect';

export class LocStatsMain {
  static dependencies = [
    BuilderAspect,
    GraphqlAspect,
  ];
  static runtime = MainRuntime;
  static async provider([builder, graphql]: [
    BuilderMain,
    GraphqlMain,
  ]) {
    // @ts-ignore
    builder.registerBuildTasks([new LocStats(LocStatsAspect.id)]);
    // @ts-ignore
    graphql.register(locStatsSchema(builder));

    return new LocStatsMain();
  }
}

LocStatsAspect.addRuntime(LocStatsMain);
