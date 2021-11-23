import { BuilderEnv } from '@teambit/envs';
import { ComponentLinesCounter } from '@teambit/pipelines.examples.modules.component-lines-counter';
import { MyReactLinesCounterAspect } from './my-react-lines-counter.aspect';

// The Env class should only implement the services it overrides
export class MyReactLinesCounter implements BuilderEnv {
  getBuildPipe() {
    return [new ComponentLinesCounter(MyReactLinesCounterAspect.id)];
  }
}
