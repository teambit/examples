import { CompilerEnv, BuilderEnv } from '@teambit/envs';
import { MyCompilerNoSmMain } from '@teambit/compilation.examples.extensions.my-compiler-no-sm';

// The Env class should only implement the services it overrides
export class MyReactM implements CompilerEnv, BuilderEnv {
  constructor(private myCompilerNoSm: MyCompilerNoSmMain) {}

  myCompiler = this.myCompilerNoSm.createCompiler();

  getCompiler() {
    return this.myCompiler;
  }

  // eslint-disable-next-line class-methods-use-this
  getBuildPipe() {
    return [this.myCompiler.createTask()];
  }
}
