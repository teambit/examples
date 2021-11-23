import { BuilderEnv } from '@teambit/envs';
import { ReactEnv } from '@teambit/react';
import { ComponentLinesCounter } from '@teambit/pipelines.examples.modules.component-lines-counter';
import { MyReactLinesCounterAspect } from './my-react-lines-counter.aspect';

// The Env class should only implement the services it overrides
export class MyReactLinesCounter implements BuilderEnv {
  constructor(private reactEnv: ReactEnv) {}

  getBuildPipe() {
    return [
      ...this.reactEnv.getBuildPipe(),
      new ComponentLinesCounter(MyReactLinesCounterAspect.id),
    ];
  }
}
