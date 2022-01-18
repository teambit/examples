import { MainRuntime } from '@teambit/cli';
import { HtmlS3Aspect } from './html-s3.aspect';
import { ApplicationAspect, ApplicationMain } from '@teambit/application';
// import { Workspace, WorkspaceAspect } from '@teambit/workspace';
import { WebpackMain, WebpackAspect } from '@teambit/webpack';
// import { HtmlS3App } from './html-s3.application';
import { HtmlS3AppType } from './html-s3.app-type';

export class HtmlS3Main {
  static slots = [];
  static dependencies = [ApplicationAspect, WebpackAspect];
  static runtime = MainRuntime;
  static async provider([application, webpack]: [
    ApplicationMain,
    WebpackMain
  ]) {
    application.registerAppType(new HtmlS3AppType('html-s3', webpack));
    return new HtmlS3Main();
  }
}

HtmlS3Aspect.addRuntime(HtmlS3Main);
