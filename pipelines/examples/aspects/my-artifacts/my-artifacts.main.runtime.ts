import { MainRuntime } from '@teambit/cli';
import { MyArtifactsAspect } from './my-artifacts.aspect';

export class MyArtifactsMain {
  static slots = [];
  static dependencies = [];
  static runtime = MainRuntime;
  static async provider() {
    return new MyArtifactsMain();
  }
}

MyArtifactsAspect.addRuntime(MyArtifactsMain);
