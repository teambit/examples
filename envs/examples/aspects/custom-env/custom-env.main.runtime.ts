import { MainRuntime } from '@teambit/cli';
import { EnvsMain, EnvsAspect } from '@teambit/envs';
import { CompilerMain, CompilerAspect } from '@teambit/compiler';
import { BabelMain, BabelAspect } from '@teambit/babel';
import { CustomEnv } from './custom-env.env';
import { CustomEnvAspect } from './custom-env.aspect';

export class CustomEnvMain {
  // List this env's dependencies (other aspects used by it)
  static dependencies = [EnvsAspect, CompilerAspect, BabelAspect];
  static runtime = MainRuntime;
  // Provide the env with the relevant aspect instances (the instances are injected by Bit)
  static async provider([envs, compiler, babel]: [
    EnvsMain,
    CompilerMain,
    BabelMain
  ]) {
    // Create a 'cusotm env' instance
    const customEnv = new CustomEnv(compiler, babel);
    // Register the 'cusotm env' instance as an env
    envs.registerEnv(customEnv);
    return new CustomEnvMain();
  }
}

CustomEnvAspect.addRuntime(CustomEnvMain);
