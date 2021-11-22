import { TesterEnv } from '@teambit/envs';
import { MochaMain } from '@company/examples.examples.extensions.mocha';

// The Env class should only implement the services it overrides
export class MyReactNoSm implements TesterEnv {
  constructor(private tester: MochaMain) {}

  getTester() {
    return this.tester.createTester();
  }
}
