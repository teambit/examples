import { ApplicationType } from '@teambit/application';
import { HtmlFirebaseApp } from './html-firebase.application';

export type HtmlFirebaseOptions = {
  /**
   * name of the application.
   */
  name: string;

  /**
   * path to entry files of the application.
   */

  entry: string[];
};

export class HtmlFirebaseAppType
  implements ApplicationType<HtmlFirebaseOptions>
{
  constructor(readonly name: string, private reactEnv: ReactEnv) {}

  createApp(options: ReactAppOptions) {
    return new HtmlFirebaseApp(options.name, options.entry);
  }
}
