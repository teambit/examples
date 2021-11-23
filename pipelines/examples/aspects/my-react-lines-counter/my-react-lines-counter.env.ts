import { BuilderEnv } from '@teambit/envs';
import { BuildTask } from '@teambit/builder';
import { ComponentLinesCounter } from '@teambit/pipelines.examples.modules.component-lines-counter';
import { MyReactLinesCounterAspect } from './my-react-lines-counter.aspect';

// The Env class should only implement the services it overrides
export class MyReactLinesCounter implements BuilderEnv {
  constructor(private reactPipeline: BuildTask[]) {}

  getBuildPipe() {
    return [
      ...this.reactPipeline,
      new ComponentLinesCounter(MyReactLinesCounterAspect.id),
    ];
  }
}
