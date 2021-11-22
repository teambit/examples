import { MainRuntime } from '@teambit/cli';
import { MochaAspect } from './mocha.aspect';
import { Mocha } from './mocha.tester';

export class MochaMain {
  createTester() {
    return new Mocha(MochaAspect.id);
  }

  static dependencies = [];
  static runtime = MainRuntime;
  static async provider() {
    return new MochaMain();
  }
}

MochaAspect.addRuntime(MochaMain);
