import { DeploymentProvider, DeployContext } from '@teambit/application';
import { Capsule } from '@teambit/isolator';
import Minio from 'minio';

export class S3Deploy implements DeploymentProvider {
  async deploy(context: DeployContext, capsule: Capsule): Promise<void> {}
}
