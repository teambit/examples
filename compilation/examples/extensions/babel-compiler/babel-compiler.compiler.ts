import * as babel from '@babel/core';
import fs from 'fs-extra';
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
import path from 'path';

export class BabelCompiler implements Compiler {
  // Determines whether unsupported files (such as assets)
  // should be copied by Compiler aspect into the 'dist' directory
  shouldCopyNonSupportedFiles = true;

  displayName = 'Babel';

  constructor(
    readonly id: string,
    readonly distDir: string,
    private compiler: CompilerMain
  ) {}

  // Returns the Babel version being used in this Aspect
  // for example, when running 'bit env <component-id>'
  version() {
    return babel.version;
  }

  // The 'transformFileAsync' API is used here (not 'transformSync')
  // because, unlike in Workspace compilation, we only get (form the Builder aspect)
  // the file path, not its content 
  transpileFile(
    fileContent: string,
    options: TranspileFileParams
  ): TranspileFileOutput {
    const result = babel.transformSync(fileContent);
    const compiledContent: string = result.code || '';
    /* Generate the path to the output file based on the file's  */
    const compiledFilename = this.replaceFileExtToJs(options.filePath);
    return [{ outputText: compiledContent, outputPath: compiledFilename }];
  }

  
   // Compiles components inside isolated capsules.
   // The Builder aspect (during bit build/tag/snap commands), passes the components to be built,
   // to this method and expects the output to be written inside the each component's capsule.
   // The compiler output is used (among other things) for the component package.
  async build(context: BuildContext): Promise<BuiltTaskResult> {
    // 'Seeder Capsules' are Component Capsules that are being built -
    // not their dependencies.
    // There could be cases where the component dependencies should affect the compilation,
    // but not in this case.
    const capsules = context.capsuleNetwork.seedersCapsules;
    const componentsResults = await Promise.all(
      capsules.map(async (capsule) => {
        // Retrieve the component's file names and extensions
        const errors: Error[] = [];
        const sourceFiles = capsule.component.filesystem.files.map(
          (file) => file.relative
        );
        const supportedFiles = sourceFiles.filter((sourceFile) =>
          this.isFileSupported(sourceFile)
        );
        await Promise.all(
          supportedFiles.map(async (filePath) => {
            // Generate a full path to the file to be compiled
            const absoluteFilePath = path.join(capsule.path, filePath);
            try {
              // Use transpileFilePathAsync API (and not the transformSync) to compile a file (from the component capsule) and not the file's content
              const result = await babel.transformFileAsync(absoluteFilePath);
              const compiledCode = result?.code || '';
              const distPath = this.replaceFileExtToJs(filePath);
              await fs.outputFile(
                path.join(capsule.path, this.distDir, distPath),
                compiledCode
              );
            } catch (err: any) {
              errors.push(err);
            }
          })
        );
        return { component: capsule.component, errors } as ComponentResult;
      })
    );
    return {
      // Sets the files to persist as the Component's artifacts,
      // and describes them.
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

  //Given a source file, returns its parallel in the dists. e.g. index.ts => dist/index.js.
  
  getDistPathBySrcPath(srcPath: string) {
    const fileWithJSExtIfNeeded = this.replaceFileExtToJs(srcPath);
    return path.join(this.distDir, fileWithJSExtIfNeeded);
  }

   // `createTask()` is optional but recommended.
   // Not using it will require consumers of your compiler to use two APIs and have two dependencies
   // to their Envs - your compiler
  createTask() {
    return this.compiler.createTask('MyCompilerSM', this);
  }

  // Checks if Babel is able to compile the given path.
  // Used (among others) by Compiler aspect to copy the file to the dists dir if not supported.
  isFileSupported(filePath: string): boolean {
    const supportedExtensions = ['.js', '.jsx'];
    return supportedExtensions.some((ext) => filePath.endsWith(ext));
  }

  private replaceFileExtToJs(filePath: string): string {
    if (!this.isFileSupported(filePath)) return filePath;
    const fileExtension = path.extname(filePath);
    return filePath.replace(new RegExp(`${fileExtension}$`), '.js');
  }
}
