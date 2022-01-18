import path from 'path';
import { Application, AppContext, DeployContext } from '@teambit/application';
import { DevServerContext, BundlerContext } from '@teambit/bundler';
import { WebpackMain, WebpackConfigTransformer } from '@teambit/webpack';
import { Port } from '@teambit/toolbox.network.get-port';
import { join, sep, posix, extname } from 'path';
import fs from 'fs';
import { Capsule } from '@teambit/isolator';
import { ArtifactDefinition, BuildContext } from '@teambit/builder';
import { WebpackConfigMutator } from '@teambit/webpack.modules.config-mutator';
import { AppBuildResult } from '@teambit/application';
import glob from 'glob';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import mime from 'mime-types';
import { webpackConfig } from './webpack.config';

export type S3Config = {
  bucket: string;
  region: string;
  credentialsProfile?: string;
};

export class HtmlS3App implements Application {
  constructor(
    readonly name: string,
    readonly entry: string[],
    private webpack: WebpackMain,
    readonly s3Config: S3Config
  ) {}

  private readonly outputDir = 'html-s3';

  // Implement a dev server
  async run(context: AppContext): Promise<number> {
    // Create a dev server instance using the specific app's config (file entries, etc.),
    const devServer = this.webpack.createDevServer(
      this.getDevServerContext(context),
      // change Webpack's default config for development using this transformer
      [this.createTransformer(webpackConfig)]
    );

    // Set an acceptable port range for the dev server
    const port = await Port.getPort(1025, 1050);
    await devServer.listen(port);
    return port;
  }

  // this method builds the app before it is deployed
  // it is executed as part of the build pipeline
  async build(
    context: BuildContext,
    capsule: Capsule
  ): Promise<AppBuildResult> {
    // add Webpack 'path' property
    const absOutputPath = join(capsule.path, this.outputDir);
    // wrap the webpack config with a 'config mutator' to modify it using a set of handy methods
    // here, the bundle output path is configured to '/html-s3' instead of the generic '/public'
    const prodWebpackConfig = new WebpackConfigMutator(
      webpackConfig
    ).addTopLevel('output', {
      path: absOutputPath,
    });
    // 'createPreviewBundler' is used (instead of 'createBundler') to make use of
    // Webpack's default config for 'preview' (generate html, inject bundle, etc)
    const bundler = this.webpack.createPreviewBundler(
      this.getBundlerContext(context, capsule),
      // the 'raw' property holds the raw webpack config
      [this.createTransformer(prodWebpackConfig.raw)]
    );
    const bundlerResults = await bundler.run();

    // select the relevant artifacts for this app's build and provide them with metadata
    // these artifacts will be persisted in the Component version and available
    // for the 'deploy' method (which is executed as part of the `tag` and `snap` pipelines)
    const artifacts: ArtifactDefinition[] = [
      {
        name: this.name,
        // 'public' is the default output directory (set in Bit's Webpack default config)
        globPatterns: [`${this.outputDir}/**`],
      },
    ];
    const appBuildResult: AppBuildResult = Object.assign(context, {
      artifacts,
    });
    return appBuildResult;
  }

  // deploy the build to an s3 bucket
  async deploy(context: DeployContext, capsule: Capsule): Promise<void> {
    const filePaths = this.getFilesToUpload(capsule);
    const objectsToUpload = this.mapFilesToObjects(filePaths);
    this.uploadObjects(objectsToUpload);
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
        // files to bundle
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

  private getFilesToUpload(capsule: Capsule): string[] {
    const absOutputPath = join(capsule.path, this.outputDir);
    const filePaths = glob.sync(`${absOutputPath}/**`, { nodir: true });
    return filePaths;
  }

  private mapFilesToObjects(filesPaths) {
    const objects = filesPaths.map((filePath) => {
      // prepare destination path
      let relDestPath = filePath.split(`${this.outputDir}${sep}`)[1];
      if (relDestPath.includes('\\')) {
        relDestPath = relDestPath.split(sep).join(posix.sep);
      }
      const object = {
        Bucket: this.s3Config.bucket,
        Key: relDestPath,
        Body: fs.readFileSync(filePath),
        ContentDisposition: 'inline',
        ContentType: mime.lookup(extname(relDestPath)),
      };
      return object;
    });
    return objects;
  }

  private async uploadObjects(objects: any[]) {
    const s3Client = new S3Client({
      credentials: fromIni({ profile: this.s3Config.credentialsProfile }),
      region: this.s3Config.region,
    });

    objects.forEach(async (object) => {
      try {
        const results = await s3Client.send(new PutObjectCommand(object));
        console.log(
          `Successfully created ${object.Key} and uploaded it to ${object.Bucket}/${object.Key}`
        );
        return results;
      } catch (err) {
        console.log('Error', err);
      }
    });
  }
}
