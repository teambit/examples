import { MainRuntime } from '@teambit/cli';
import { HtmlFirebaseAspect } from './html-firebase.aspect';
import { ApplicationAspect, ApplicationMain } from '@teambit/application';
import { Workspace, WorkspaceAspect } from '@teambit/workspace';
import { WebpackMain, WebpackAspect } from '@teambit/webpack';
import { HtmlFirebaseApp } from './html-firebase.application';

export class HtmlFirebaseMain {
  static slots = [];
  static dependencies = [ApplicationAspect, WebpackAspect, WorkspaceAspect];
  static runtime = MainRuntime;
  static async provider([application, webpack, workspace]: [
    ApplicationMain,
    WebpackMain,
    Workspace
  ]) {
    application.registerAppType(
      new HtmlFirebaseApp('html-firebase', webpack, workspace)
    );
    return new HtmlFirebaseMain();
  }
}

HtmlFirebaseAspect.addRuntime(HtmlFirebaseMain);
