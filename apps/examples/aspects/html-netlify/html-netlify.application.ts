import path from 'path';
import { Application, AppContext } from '@teambit/application';
import { DevServerContext, BundlerContext } from '@teambit/bundler';
import { WebpackMain, WebpackConfigTransformer } from '@teambit/webpack';
import { Port } from '@teambit/toolbox.network.get-port';
import { Capsule } from '@teambit/isolator';
import { ArtifactDefinition, BuildContext } from '@teambit/builder';
import { AppBuildResult } from '@teambit/application';
import webpackDevConfig from './webpack/webpack.dev.config';
import webpackProdConfig from './webpack/webpack.prod.config';

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
    // 'createPreviewBundler' is used (instead of 'createBundler') to make use of
    // Webpack's default config for 'preview' (generate html, inject bundle, etc)
    const bundler = this.webpack.createPreviewBundler(
      this.getBundlerContext(context, capsule),
      [this.createTransformer(webpackProdConfig)]
    );
    const bundlerResults = await bundler.run();
    console.log(
      '🚀 ~ file: html-netlify.application.ts ~ line 43 ~ HtmlNetlifyApp ~ bundlerResults',
      bundlerResults
    );

    const artifacts: ArtifactDefinition[] = [
      {
        name: 'html-netlify',
        // 'public' is the default output directory (set in Webpack's default config)
        globPatterns: ['public/**'],
      },
    ];
    const appBuildResult: AppBuildResult = Object.assign(context, {
      artifacts,
    });
    return appBuildResult;
  }

  // generate a webpack transformer out of webpack config
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
