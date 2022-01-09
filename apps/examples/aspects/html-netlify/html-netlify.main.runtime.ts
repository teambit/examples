import { MainRuntime } from '@teambit/cli';
import { HtmlNetlifyAspect } from './html-netlify.aspect';
import { ApplicationAspect, ApplicationMain } from '@teambit/application';
// import { Workspace, WorkspaceAspect } from '@teambit/workspace';
import { WebpackMain, WebpackAspect } from '@teambit/webpack';
import { HtmlNetlifyApp } from './html-netlify.application';
import { HtmlNetlifyAppType } from './html-netlify.app-type';

export class HtmlNetlifyMain {
  static slots = [];
  static dependencies = [ApplicationAspect, WebpackAspect];
  static runtime = MainRuntime;
  static async provider([application, webpack]: [
    ApplicationMain,
    WebpackMain
  ]) {
    application.registerAppType(
      new HtmlNetlifyAppType('html-netlify', webpack)
    );
    return new HtmlNetlifyMain();
  }
}

HtmlNetlifyAspect.addRuntime(HtmlNetlifyMain);
