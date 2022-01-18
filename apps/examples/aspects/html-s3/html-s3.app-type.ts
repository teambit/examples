import { ApplicationType, DeployFn } from '@teambit/application';
import { HtmlS3App } from './html-s3.application';
import { WebpackMain } from '@teambit/webpack';
import { S3Config } from './html-s3.application';

export type HtmlS3Options = {
  // application name
  name: string;
  // paths to entry files
  entry: string[];
  s3Config: S3Config;
};

export class HtmlS3AppType implements ApplicationType<HtmlS3Options> {
  constructor(readonly name: string, readonly webpack: WebpackMain) {}

  createApp(options: HtmlS3Options) {
    return new HtmlS3App(
      options.name,
      options.entry,
      this.webpack,
      options.s3Config
    );
  }
}
