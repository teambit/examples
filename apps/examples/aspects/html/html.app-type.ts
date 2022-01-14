import { ApplicationType, DeployFn } from '@teambit/application';
import { HtmlApp } from './html.application';
import { Workspace } from '@teambit/workspace';
import { WebpackMain } from '@teambit/webpack';

export type HtmlOptions = {
  // application name
  name: string;
  // paths to entry files
  entry: string[];
  // deploy function (e.g, netlify, firebase, etc.)
  deploy: DeployFn;
};

export class HtmlAppType implements ApplicationType<HtmlOptions> {
  constructor(readonly name: string, readonly webpack: WebpackMain) {}

  createApp(options: HtmlOptions) {
    return new HtmlApp(
      options.name,
      options.entry,
      options.deploy,
      this.webpack
    );
  }
}
