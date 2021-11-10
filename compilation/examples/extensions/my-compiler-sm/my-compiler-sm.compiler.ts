import babel from '@babel/core';
import fs from 'fs-extra';
import path from 'path';
import {
  BuildContext,
  BuiltTaskResult,
  ComponentResult,
} from '@teambit/builder';
import {
  Compiler,
  CompilerMain,
  TranspileFileParams,
  TranspileFileOutput,
} from '@teambit/compiler';
import { Capsule } from '@teambit/isolator';

export class MyCompilerSM implements Compiler {
  distDir = 'dist';

  /**
   * Detemines whether unsupported files (such as assets)
   * should be copied by Compiler aspect into the 'dist' directory
   */
  shouldCopyNonSupportedFiles = true;

  displayName = 'Babel';

  constructor(readonly id: string, private compiler: CompilerMain) {}

  /* Returns the Babel version being used in this Aspect
   * for example, when running 'bit env <component-id>'
   */
  version() {
    return babel.version;
  }

  /**
   * The Compiler aspect reads the component files, and passes them to 'transpileFile()',
   * one file's content at a time.
   * For this reason,'transformSync' API is used and not 'transformFileAsync' (used in 'build()')
   */
  transpileFile(
    fileContent: string,
    transpileFileParams: TranspileFileParams
  ): TranspileFileOutput {
    const supportedExtensions = ['.ts', '.tsx', '.js', '.jsx'];
    const fileExtension = path.extname(transpileFileParams.filePath);
    if (!supportedExtensions.includes(fileExtension)) {
      return null; // file is not supported
    }
    if (!this.isFileSupported(transpileFileParams.filePath)) {
      return null; // file is not supported
    }
    const result = babel.transformSync(fileContent, { sourceMaps: true });
    if (!result) {
      return null;
    }
    const compiledCode = result.code || '';
    const outputPath = this.replaceFileExtToJs(transpileFileParams.filePath);
    const mapFilePath = `${outputPath}.map`;
    const mapFileBasename = path.basename(mapFilePath);
    const sourceMapContent = result.map;
    /* Combine together the compiled code with its source map reference */
    const compiledCodeWithMapRef = sourceMapContent
      ? `${compiledCode}\n\n//# sourceMappingURL=${mapFileBasename}`
      : compiledCode;
    const outputFiles = [{ outputText: compiledCodeWithMapRef, outputPath }];
    if (sourceMapContent) {
      outputFiles.push({
        outputText: JSON.stringify(sourceMapContent),
        outputPath: mapFilePath,
      });
    }
    return outputFiles;
  }

  /**
   * Compiles components inside isolated capsules.
   * The Builder aspect (during bit build/tag/snap commands), passes the components to be built,
   * to this method and expects the output to be written inside the each component's capsule.
   * The compiler output is used (among other things) for the component package.
   */
  async build(context: BuildContext): Promise<BuiltTaskResult> {
    /* 'Seeder Capsules' are Component Capsules that are being built,
     * not their dependencies.
     * There could be cases where the component dependencies should affect its compilation,
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
          name: 'my compiler with sm output',
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
          const result = await this.transpileFilePathAsync(absoluteFilePath);
          if (!result || !result.length) {
            // component files might be ignored by Babel, e.g. scss component.
            return;
          }
          const distPath = this.replaceFileExtToJs(filePath);
          const distPathMap = `${distPath}.map`;
          await fs.outputFile(
            path.join(capsule.path, this.distDir, distPath),
            result[0].outputText
          );
          if (result.length > 1) {
            // we got also the source map, write it.
            await fs.outputFile(
              path.join(capsule.path, this.distDir, distPathMap),
              result[1].outputText
            );
          }
        } catch (err: any) {
          componentResult.errors?.push(err);
        }
      })
    );
  }

  createTask() {
    return this.compiler.createTask('MyCompilerSM', this);
  }

  /**
   * Given a source file, return its parallel in the dists. e.g. index.ts => dist/index.js.
   * Needed by aspects such as Pkg to determine the main prop.
   */
  getDistPathBySrcPath(srcPath: string) {
    const fileWithJSExtIfNeeded = this.replaceFileExtToJs(srcPath);
    return path.join(this.distDir, fileWithJSExtIfNeeded);
  }

  /**
   * whether babel is able to compile the given path.
   * used (among others) by Compiler aspect to copy the file to the dists dir if not supported.
   */
  isFileSupported(filePath: string): boolean {
    return (
      filePath.endsWith('.ts') ||
      filePath.endsWith('.tsx') ||
      filePath.endsWith('.js') ||
      filePath.endsWith('.jsx')
    );
  }

  private async transpileFilePathAsync(filePath: string) {
    if (!this.isFileSupported(filePath)) {
      return null;
    }
    /* The 'transformFileAsync' API is used here (not 'transformSync')
     * because, unlike in Workspace compilation, we only get (form the Builder aspect)
     * the file path, not its content */

    const result = await babel.transformFileAsync(filePath, {
      sourceMaps: true,
    });
    if (!result || !result.code) {
      return null;
    }
    const outputPath = this.replaceFileExtToJs(path.basename(filePath));
    const mapFilePath = `${outputPath}.map`;
    const code = result.code || '';
    const outputText = result.map
      ? `${code}\n\n//# sourceMappingURL=${mapFilePath}`
      : code;
    const outputFiles = [{ outputText, outputPath }];
    if (result.map) {
      outputFiles.push({
        outputText: JSON.stringify(result.map),
        outputPath: mapFilePath,
      });
    }
    return outputFiles;
  }

  private replaceFileExtToJs(filePath: string): string {
    if (!this.isFileSupported(filePath)) return filePath;
    const fileExtension = path.extname(filePath);
    return filePath.replace(new RegExp(`${fileExtension}$`), '.js'); // Makes sure it's the last occurrence
  }
}
