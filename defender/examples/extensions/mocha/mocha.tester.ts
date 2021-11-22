import { Tester, Tests, TesterContext } from '@teambit/tester';

export class Mocha implements Tester {
  constructor(readonly id: string) {}

  test(context: TesterContext): Promise<Tests> {}

  version() {
    return '1.0.0';
  }
}
