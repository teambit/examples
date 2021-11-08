import { MainRuntime } from '@teambit/cli';
import { CompilerAspect, CompilerMain } from '@teambit/compiler';
import { MyCompilerSM } from './my-compiler-sm.compiler';
import { MyCompilerSMAspect } from './my-compiler-sm.aspect';

export class MyCompilerSMMain {
  constructor(private compiler: CompilerMain) {}

  static dependencies = [CompilerAspect];

  static runtime = MainRuntime;

  createCompiler(): MyCompilerSM {
    return new MyCompilerSM(MyCompilerSMAspect.id, this.compiler);
  }

  // eslint-disable-next-line class-methods-use-this
  getPackageJsonProps() {
    return {
      main: 'dist/{main}.js',
    };
  }

  static async provider([compiler]: [CompilerMain]) {
    return new MyCompilerSMMain(compiler);
  }
}

MyCompilerSMAspect.addRuntime(MyCompilerSMMain);
