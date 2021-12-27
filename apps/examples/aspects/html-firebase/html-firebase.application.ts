import { Application, AppContext } from '@teambit/application';
import { DevServerContext } from '@teambit/bundler';
import { WebpackMain, WebpackConfigTransformer } from '@teambit/webpack';
import { Workspace } from '@teambit/workspace';
import { Port } from '@teambit/toolbox.network.get-port';
// import webpack configs
import webpackBaseConfig from './webpack/webpack.config.base';
import webpackDevConfig from './webpack/webpack.config.dev';
import webpackProdConfig from './webpack/webpack.config.prod';

export class HtmlFirebaseApp implements Application {
  constructor(
    readonly name,
    readonly entry,
    private webpack: WebpackMain,
    private workspace: Workspace
  ) {}

  // Implement a dev server
  async run(context: AppContext): Promise<number> {
    // Create webpack config mutators.
    // These will be used by the Webpack aspect, to modify its default config.
    const webpackConfigTranformers: WebpackConfigTransformer = (
      configMutator
    ) => {
      const merged = configMutator.merge([
        webpackBaseConfig(),
        webpackDevConfig(this.workspace.path),
      ]);
      return merged;
    };
    // Create a dev server instance using the specific app's config (file entries, etc.),
    // and the Webpack config mutators
    const devServer = this.webpack.createDevServer(
      this.getDevServerContext(context),
      [webpackConfigTranformers]
    );

    // Set an accceptable port range for the dev server
    const port = await Port.getPort(1025, 1050);
    await devServer.listen(port);
    return port;
  }

  build(
    context: BuildContext,
    aspectId: string,
    capsule: Capsule
  ): Promise<DeployContext>;

  deploy?(context: BuildContext): Promise<void>;

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
