import { MainRuntime } from '@teambit/cli';
import { DevFilesAspect, DevFilesMain } from '@teambit/dev-files';
import { MyDevFilesAspect } from './my-dev-files.aspect';

export class MyDevFilesMain {
  constructor(private devFiles: DevFilesMain) {}

  static slots = [];

  static dependencies = [DevFilesAspect];

  static runtime = MainRuntime;

  static async provider([devFiles]: [DevFilesMain]) {
    devFiles.registerDevPattern(['**/*.my-dev.*']);

    return new MyDevFilesMain(devFiles);
  }
}

MyDevFilesAspect.addRuntime(MyDevFilesMain);
