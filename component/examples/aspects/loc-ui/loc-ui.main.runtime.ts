import { MainRuntime } from '@teambit/cli';
import { LocUiAspect } from './loc-ui.aspect';

export class LocUiMain {
  static slots = [];
  static dependencies = [];
  static runtime = MainRuntime;
  static async provider() {
    return new LocUiMain();
  }
}

LocUiAspect.addRuntime(LocUiMain);
