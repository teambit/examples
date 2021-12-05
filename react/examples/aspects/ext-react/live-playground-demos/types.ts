import type { SchemaExtractor } from '@teambit/schema';

export interface Environment {
  /**
   * name of the environment.
   */
  name?: string;

  /**
   * description of the environment.
   */
  description?: string;

  /**
   * icon of the environment.
   */
  icon?: string;

  [key: string]: any; // :TODO need to define an abstract type for service handlers (now using any)

  /**
   * Returns the Environment descriptor
   * Required for any task
   */
  __getDescriptor?: () => Promise<EnvDescriptor>;

  /**
   * Returns a schema generator instance
   */
  getSchemaExtractor?: (config?: any) => SchemaExtractor;
}

export type EnvDescriptor = {
  type: string;
};

export type EnvTransformer = (env: Environment) => Environment;
