import { MainRuntime } from '@teambit/cli';
import { BuilderMain, BuilderAspect } from '@teambit/builder';
import { ScopeMain, ScopeAspect } from '@teambit/scope';
import {
  ComponentMain,
  ComponentAspect,
  ComponentID,
  Component,
} from '@teambit/component';
import { MyArtifactsFetcherAspect } from './my-artifacts-fetcher.aspect';

export class MyArtifactsFetcherMain {
  static slots = [];
  static dependencies = [ScopeAspect, BuilderAspect];
  static runtime = MainRuntime;
  static async provider([scope, builder]: [ScopeMain, BuilderMain]) {
    const comp = (await scope.get(
      ComponentID.fromString(
        'teambit.compilation/examples/aspects/babel-compiler'
      )
    )) as Component;
    const art = builder.getArtifacts(comp);
    console.log('>>>> ART', art);
    return new MyArtifactsFetcherMain();
  }
}

MyArtifactsFetcherAspect.addRuntime(MyArtifactsFetcherMain);
