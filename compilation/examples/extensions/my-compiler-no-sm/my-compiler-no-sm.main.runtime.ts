import { MainRuntime } from '@teambit/cli';
import { CompilerAspect, CompilerMain } from '@teambit/compiler';
import { MyCompilerNoSm } from './my-compiler-no-sm.compiler';
import { MyCompilerNoSmAspect } from './my-compiler-no-sm.aspect';

export class MyCompilerNoSmMain {
  constructor(private compiler: CompilerMain) {}

  static dependencies = [CompilerAspect];

  static runtime = MainRuntime;

  createCompiler(): MyCompilerNoSm {
    return new MyCompilerNoSm(MyCompilerNoSmAspect.id, this.compiler);
  }

  // eslint-disable-next-line class-methods-use-this
  getPackageJsonProps() {
    return {
      main: 'dist/{main}.js',
    };
  }

  static async provider([compiler]: [CompilerMain]) {
    return new MyCompilerNoSmMain(compiler);
  }
}

MyCompilerNoSmAspect.addRuntime(MyCompilerNoSmMain);
