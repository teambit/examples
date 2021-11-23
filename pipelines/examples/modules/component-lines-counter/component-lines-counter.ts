import {
  BuildTask,
  BuildContext,
  BuiltTaskResult,
  ComponentResult,
} from '@teambit/builder';
import path from 'path';
import fs from 'fs-extra';
import linesCount from 'file-lines-count';

export class ComponentLinesCounter implements BuildTask {
  constructor(readonly aspectId: string) {}

  readonly name = 'ComponentLinesCounter';

  async execute(context: BuildContext): Promise<BuiltTaskResult> {
    const capsules = context.capsuleNetwork.seedersCapsules;
    const componentsResults = await Promise.all(
      capsules.map(async (capsule) => {
        let errors: Error[] = [];
        const outputFileContent = await this.getComponentLinesCountReport(
          capsule
        );
        try {
          await fs.outputFile(
            path.join(capsule.path, 'count.txt'),
            outputFileContent
          );
        } catch (err: any) {
          errors.push(err);
        }
        return { component: capsule.component, errors } as ComponentResult;
      })
    );
    return {
      // Sets the files to persist as the Component's artifacts,
      // and describes them.
      artifacts: [
        {
          generatedBy: this.aspectId,
          name: this.name,
          globPatterns: ['count.txt'],
        },
      ],
      componentsResults,
    };
  }

  private async getComponentLinesCountReport(capsule) {
    const files = capsule.component.filesystem.files;
    let FileContent = '';
    for (const file of files) {
      const filePath = path.join(capsule.path, file.path);
      const numOfLines = await linesCount(filePath);
      FileContent += `* ${file.path} has ${numOfLines} lines.\n`;
    }
    return FileContent;
  }
}
