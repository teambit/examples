import { CompilerEnv, BuilderEnv } from '@teambit/envs';
import { MyCompilerSMMain } from '@teambit/compilation.examples.extensions.my-compiler-sm';

// The Env class should only implement the services it overrides
export class MyReactSM implements CompilerEnv, BuilderEnv {
  constructor(private myCompilerSM: MyCompilerSMMain) {}

  myCompiler = this.myCompilerSM.createCompiler();

  getCompiler() {
    return this.myCompiler;
  }

  // eslint-disable-next-line class-methods-use-this
  getBuildPipe() {
    return [this.myCompiler.createTask()];
  }
}
