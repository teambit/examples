import { MainRuntime } from '@teambit/cli';
import { BuilderMain, BuilderAspect } from '@teambit/builder';
import { MyTask } from '@teambit/pipelines.examples.modules.my-task';
import { AspectMyTaskAspect } from './aspect-my-task.aspect';

export class AspectMyTaskMain {
  static slots = [];
  static dependencies = [BuilderAspect];
  static runtime = MainRuntime;
  static async provider([builder]: [BuilderMain]) {
    builder.registerBuildTasks([new MyTask(AspectMyTaskAspect.id)]);
    return new AspectMyTaskMain();
  }
}

AspectMyTaskAspect.addRuntime(AspectMyTaskMain);
