import { Application, AppContext } from '@teambit/application';
import { DevServerContext } from '@teambit/bundler';
import { WebpackMain, WebpackConfigTransformer } from '@teambit/webpack';
import { Port } from '@teambit/toolbox.network.get-port';
// import webpack configs
// import webpackBaseConfig from './webpack/webpack.config.base';
import webpackDevConfig from './webpack/webpack.config.dev';

export class HtmlNetlifyApp implements Application {
  constructor(readonly name, readonly entry, private webpack: WebpackMain) {}

  // Implement a dev server
  async run(context: AppContext): Promise<number> {
    // Create webpack config mutators.
    // It will be used by the Webpack aspect, to modify its default config.
    const webpackConfigTransformer: WebpackConfigTransformer = (
      configMutator
    ) => {
      const merged = configMutator.merge([webpackDevConfig]);
      return merged;
    };
    // Create a dev server instance using the specific app's config (file entries, etc.),
    // and the Webpack config mutators
    const devServer = this.webpack.createDevServer(
      this.getDevServerContext(context),
      [webpackConfigTransformer]
    );

    // Set an acceptable port range for the dev server
    const port = await Port.getPort(1025, 1050);
    await devServer.listen(port);
    return port;
  }

  // map app context to dev server context
  private getDevServerContext(context: AppContext): DevServerContext {
    return Object.assign(context, {
      entry: this.entry,
      rootPath: '',
      publicPath: `public/${this.name}`,
      title: this.name,
    });
  }
}
