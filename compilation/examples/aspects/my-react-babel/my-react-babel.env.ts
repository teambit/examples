import { CompilerEnv, BuilderEnv } from '@teambit/envs';
import { BabelCompilerMain } from '@teambit/compilation.examples.aspects.babel-compiler';

// The Env class should only implement the services it overrides
export class MyReactBabel implements CompilerEnv, BuilderEnv {
  constructor(private babelCompiler: BabelCompilerMain) {}

  getCompiler() {
    return this.babelCompiler.createCompiler();
  }

  getBuildPipe() {
    return [this.babelCompiler.createCompiler().createTask()];
  }
}
