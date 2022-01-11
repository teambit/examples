import { Application, AppContext } from '@teambit/application';
import { DevServerContext, BundlerContext } from '@teambit/bundler';
import { WebpackMain, WebpackConfigTransformer } from '@teambit/webpack';
import { Port } from '@teambit/toolbox.network.get-port';
import { Capsule } from '@teambit/isolator';
import { ArtifactDefinition, BuildContext } from '@teambit/builder';
import { AppBuildResult } from '@teambit/application';
import path from 'path';
import webpackDevConfig from './webpack/webpack.dev.config';

export class HtmlNetlifyApp implements Application {
  constructor(
    readonly name: string,
    readonly entry: string[],
    private webpack: WebpackMain
  ) {}

  // Implement a dev server
  async run(context: AppContext): Promise<number> {
    // Create a dev server instance using the specific app's config (file entries, etc.),
    // and the Webpack config mutators
    const devServer = this.webpack.createDevServer(
      this.getDevServerContext(context),
      [this.createTransformer(webpackDevConfig)]
    );

    // Set an acceptable port range for the dev server
    const port = await Port.getPort(1025, 1050);
    await devServer.listen(port);
    return port;
  }

  async build(
    context: BuildContext,
    capsule: Capsule
  ): Promise<AppBuildResult> {
    const bundler = this.webpack.createBundler(
      this.getBundlerContext(context, capsule),
      [this.webpackConfigTransformer]
    );
    const bundlerResults = await bundler.run();
    console.log(
      '🚀 ~ file: html-netlify.application.ts ~ line 43 ~ HtmlNetlifyApp ~ bundlerResults',
      bundlerResults
    );

    const artifacts: ArtifactDefinition[] = [
      {
        name: 'html-netlify',
        globPatterns: ['public/**'],
      },
    ];
    const appBuildResult: AppBuildResult = Object.assign(context, {
      artifacts,
    });
    return appBuildResult;
  }

  a webpack transformer
  private webpackConfigTransformer: WebpackConfigTransformer = (
    configMutator
  ) => {
    const merged = configMutator.merge([webpackConfig]);
    return merged;
  };

  private createTransformer = (webpackConfig): WebpackConfigTransformer => {
    return (configMutator) => {
      const merged = configMutator.merge([webpackConfig]);
      return merged;
    };
  };

  // map app context to dev server context
  private getDevServerContext(context: AppContext): DevServerContext {
    return Object.assign(
      {
        entry: this.entry,
        rootPath: '',
        publicPath: path.join('public', this.name),
        title: this.name,
      },
      context
    );
  }

  private getBundlerContext(
    context: BuildContext,
    capsule: Capsule
  ): BundlerContext {
    return Object.assign(
      {
        targets: [
          {
            entries: this.entry,
            components: [capsule.component],
            outputPath: capsule.path,
          },
        ],
        rootPath: '/',
      },
      context
    );
  }
}
