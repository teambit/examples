import { CompilerEnv, BuilderEnv } from '@teambit/envs';
import { BabelCompilerMain } from '@teambit/compilation.examples.extensions.babel-compiler';

// The Env class should only implement the services it overrides
export class MyReactNoSm implements CompilerEnv, BuilderEnv {
  constructor(private babelCompiler: BabelCompilerMain) {}

  myBabelCompiler = this.babelCompiler.createCompiler();

  getCompiler() {
    return this.myBabelCompiler;
  }

  // eslint-disable-next-line class-methods-use-this
  getBuildPipe() {
    return [this.myBabelCompiler.createTask()];
  }
}
