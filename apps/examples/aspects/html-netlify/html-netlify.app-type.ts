import { ApplicationType } from '@teambit/application';
import { HtmlNetlifyApp } from './html-netlify.application';
import { Workspace } from '@teambit/workspace';
import { WebpackMain } from '@teambit/webpack';

export type HtmlNetlifyOptions = {
  /**
   * name of the application.
   */
  name: string;

  /**
   * path to entry files of the application.
   */

  entry: string[];
};

export class HtmlNetlifyAppType implements ApplicationType<HtmlNetlifyOptions> {
  constructor(readonly name: string, readonly webpack: WebpackMain) {}

  createApp(options: HtmlNetlifyOptions) {
    return new HtmlNetlifyApp(options.name, options.entry, this.webpack);
  }
}
