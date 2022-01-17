import { MainRuntime } from '@teambit/cli';
import { HtmlAspect } from './html.aspect';
import { ApplicationAspect, ApplicationMain } from '@teambit/application';
// import { Workspace, WorkspaceAspect } from '@teambit/workspace';
import { WebpackMain, WebpackAspect } from '@teambit/webpack';
// import { HtmlApp } from './html.application';
import { HtmlAppType } from './html.app-type';

export class HtmlMain {
  static slots = [];
  static dependencies = [ApplicationAspect, WebpackAspect];
  static runtime = MainRuntime;
  static async provider([application, webpack]: [
    ApplicationMain,
    WebpackMain
  ]) {
    application.registerAppType(new HtmlAppType('html-s3', webpack));
    return new HtmlMain();
  }
}

HtmlAspect.addRuntime(HtmlMain);
