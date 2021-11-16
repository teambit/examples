import babel from '@babel/core';
import fs from 'fs-extra';
import { BuildContext, BuiltTaskResult, ComponentResult } from '@teambit/builder';
import {
  Compiler,
  CompilerMain,
  TranspileFileParams,
  TranspileFileOutput,
} from '@teambit/compiler';

import { Capsule } from '@teambit/isolator';
import path from 'path';

export class MyCompilerNoSm implements Compiler {
  /**
   * Determines whether unsupported files (such as assets)
   * should be copied by Compiler aspect into the 'dist' directory
   */
  shouldCopyNonSupportedFiles = true;

  displayName = 'Babel';

  constructor(
    readonly id: string,
    readonly distDir: string,
    private compiler: CompilerMain
  ) {}

  /* Returns the Babel version being used in this Aspect
   * for example, when running 'bit env <component-id>'
   */
  // eslint-disable-next-line class-methods-use-this
  version() {
    return babel.version;
  }

  /* The 'transformFileAsync' API is used here (not 'transformSync')
   * because, unlike in Workspace compilation, we only get (form the Builder aspect)
   * the file path, not its content */
  transpileFile(
    fileContent: string,
    options: TranspileFileParams
  ): TranspileFileOutput {
    const result = babel.transformSync(fileContent);
    if (!result) {
      return null;
    }
    const compiledCode = result.code || '';
    const outputPath = this.replaceFileExtToJs(options.filePath);
    const outputFiles = [{ outputText: compiledCode, outputPath }];

    return outputFiles;
  }

  /**
   * Compiles components inside isolated capsules.
   * The Builder aspect (during bit build/tag/snap commands), passes the components to be built,
   * to this method and expects the output to be written inside the each component's capsule.
   * The compiler output is used (among other things) for the component package.
   */
  async build(context: BuildContext): Promise<BuiltTaskResult> {
    /* 'Seeder Capsules' are Component Capsules that are being built -
     * not their dependencies.
     * There could be cases where the component dependencies should affect the compilation,
     * but not in this case.
     */
    const capsules = context.capsuleNetwork.seedersCapsules;
    const componentsResults: ComponentResult[] = [];
    await Promise.all(
      capsules.map(async (capsule) => {
        const currentComponentResult: ComponentResult = {
          errors: [],
          component: capsule.component,
        };
        await this.buildOneCapsule(capsule, currentComponentResult);
        componentsResults.push({ ...currentComponentResult });
      })
    );

    return {
      /* Sets the files to persist as the Component's artifacts,
       and describes them. */
      artifacts: [
        {
          generatedBy: this.id,
          name: 'compiler output',
          globPatterns: [`${this.distDir}/**`],
        },
      ],
      componentsResults,
    };
  }

  private async buildOneCapsule(
    capsule: Capsule,
    componentResult: ComponentResult
  ) {
    const sourceFiles = capsule.component.filesystem.files.map(
      (file) => file.relative
    );
    await fs.ensureDir(path.join(capsule.path, this.distDir));
    await Promise.all(
      sourceFiles.map(async (filePath) => {
        const absoluteFilePath = path.join(capsule.path, filePath);
        try {
          // here we use the transpileFilePathAsync API and not the transformSync because we don't have the file content
          // only the file paths in the capsules.
          const result = await this.transpileFilePathAsync(
            absoluteFilePath,
            babel
          );
          if (!result || !result.length) {
            // component files might be ignored by Babel, e.g. scss component.
            return;
          }
          const distPath = this.replaceFileExtToJs(filePath);
          await fs.outputFile(
            path.join(capsule.path, this.distDir, distPath),
            result[0].outputText
          );
        } catch (err: any) {
          componentResult.errors?.push(err);
        }
      })
    );
  }

  /**
   * Given a source file, return its parallel in the dists. e.g. index.ts => dist/index.js.
   * Needed by aspects such as Pkg to determine the main prop.
   */
  getDistPathBySrcPath(srcPath: string) {
    const fileWithJSExtIfNeeded = this.replaceFileExtToJs(srcPath);
    return path.join(this.distDir, fileWithJSExtIfNeeded);
  }

  /* `createTask()` is optional but recommended.
  Not using it will require consumers of your compiler to use two APIs and have two depndencies
  to their Envs - your compiler
  */

  createTask() {
    return this.compiler.createTask('MyCompilerSM', this);
  }

  /**
   * Checks if Babel is able to compile the given path.
   * Used (among others) by Compiler aspect to copy the file to the dists dir if not supported.
   */
  isFileSupported(filePath: string): boolean {
    const supportedExtensions = ['.ts', '.tsx', '.js', '.jsx'];
    return supportedExtensions.some(ext => filePath.endsWith(ext));
  }

  private async transpileFilePathAsync(filePath: string, babelModule = babel) {
    const result = await babelModule.transformFileAsync(filePath);
    if (!result || !result.code) {
      return null;
    }
    const outputPath = this.replaceFileExtToJs(path.basename(filePath));
    const compiledCode = result.code || '';
    const outputFiles = [{ outputText: compiledCode, outputPath }];

    return outputFiles;
  }

  private replaceFileExtToJs(filePath: string): string {
    if (!this.isFileSupported(filePath)) return filePath;
    const fileExtension = path.extname(filePath);
    return filePath.replace(new RegExp(`${fileExtension}$`), '.js'); // makes sure it's the last occurrence
  }
}
