import { Environment, EnvTransformer } from './types';

export class EnvsMock {
  override(propsToOverride: Environment): EnvTransformer {
    return (env: Environment) => {
      return this.merge(propsToOverride, env);
    };
  }

  merge<T>(targetEnv: Environment, sourceEnv: Environment): T {
    const allNames = new Set<string>();
    const keys = ['icon', 'name', 'description'];
    for (
      let o = sourceEnv;
      o !== Object.prototype;
      o = Object.getPrototypeOf(o)
    ) {
      for (const name of Object.getOwnPropertyNames(o)) {
        allNames.add(name);
      }
    }

    allNames.forEach((key: string) => {
      const fn = sourceEnv[key];
      if (targetEnv[key]) return;
      if (keys.includes(key)) targetEnv[key] = fn;
      if (!fn || !fn.bind) {
        return;
      }
      targetEnv[key] = fn.bind(sourceEnv);
    });

    return targetEnv as T;
  }

  compose(targetEnv: Environment, envTransformers: EnvTransformer[]) {
    const a = envTransformers.reduce((acc, transformer) => {
      acc = transformer(acc);
      return acc;
    }, targetEnv);

    return a;
  }
}
