import { ApplicationType, DeployFn } from '@teambit/application';
import { HtmlApp } from './html.application';
import { WebpackMain } from '@teambit/webpack';
import { S3Config } from './html.application';

export type HtmlOptions = {
  // application name
  name: string;
  // paths to entry files
  entry: string[];
  s3Config: S3Config;
};

export class HtmlAppType implements ApplicationType<HtmlOptions> {
  constructor(readonly name: string, readonly webpack: WebpackMain) {}

  createApp(options: HtmlOptions) {
    return new HtmlApp(
      options.name,
      options.entry,
      this.webpack,
      options.s3Config
    );
  }
}
