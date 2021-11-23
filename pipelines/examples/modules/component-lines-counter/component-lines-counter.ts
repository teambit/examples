import {
  BuildTask,
  BuildContext,
  BuiltTaskResult,
  ComponentResult,
} from '@teambit/builder';
import path from 'path';
import fs from 'fs';
import linesCount from 'file-lines-count';

export class ComponentLinesCounter implements BuildTask {
  constructor(readonly aspectId: string) {}

  readonly name = 'ComponentLinesCounter';

  async execute(context: BuildContext): Promise<BuiltTaskResult> {
    const capsules = context.capsuleNetwork.seedersCapsules;
    let componentsResults: ComponentResult[] = [];

    capsules.forEach(async (capsule) => {
      let errors: Error[] = [];
      const outputFileContent = await getFileLinesCountReport(capsule);

      try {
        fs.writeFileSync(
          path.join(capsule.path, 'count.txt'),
          outputFileContent
        );
      } catch (err: any) {
        errors.push(err);
      }

      componentsResults.push({
        component: capsule.component,
        metadata: { errors },
      });
    });

    return {
      // Sets the files to persist as the Component's artifacts,
      // and describes them.
      artifacts: [
        {
          generatedBy: this.aspectId,
          name: 'lines counter output',
          globPatterns: ['count.txt'],
        },
      ],
      componentsResults,
    };
  }
}

async function getFileLinesCountReport(capsule) {
  const files = capsule.component.filesystem.files;
  let FileContent = '';
  for (const file of files) {
    const filePath = path.join(capsule.path, file.path);
    const numOfLines = await linesCount(filePath);
    FileContent += `* ${file.path} has ${numOfLines} lines.\n`;
  }
  return FileContent;
}
