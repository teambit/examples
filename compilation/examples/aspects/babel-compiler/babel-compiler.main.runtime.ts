import { MainRuntime } from '@teambit/cli';
import { CompilerAspect, CompilerMain } from '@teambit/compiler';
import { BabelCompiler } from './babel-compiler.compiler';
import { BabelCompilerAspect } from './babel-compiler.aspect';

export class BabelCompilerMain {
  constructor(private compiler: CompilerMain) {}

  static dependencies = [CompilerAspect];

  static runtime = MainRuntime;

  distDir = 'dist';

  createCompiler(): BabelCompiler {
    return new BabelCompiler(
      BabelCompilerAspect.id,
      this.distDir,
      this.compiler
    );
  }

  getPackageJsonProps() {
    return {
      main: `${this.distDir}/{main}.js`,
    };
  }

  static async provider([compiler]: [CompilerMain]) {
    return new BabelCompilerMain(compiler);
  }
}

BabelCompilerAspect.addRuntime(BabelCompilerMain);
