import {
  BuildTask,
  BuildContext,
  BuiltTaskResult,
  ComponentResult,
} from '@teambit/builder';
import { Capsule } from '@teambit/isolator';
import path from 'path';
import { promises as fs } from 'fs';
import sloc from 'sloc';
import { output } from './output';

export class LocStats implements BuildTask {
  constructor(readonly aspectId: string) {}

  readonly name = 'ComponentLocStats';

  private outputFileName = 'loc-stats.json';

  async execute(context: BuildContext): Promise<BuiltTaskResult> {
    const errors: Error[] = [];
    const capsules = context.capsuleNetwork.seedersCapsules;

    const componentsResults = await Promise.all(
      capsules.map(async (capsule) => {
        const output = await this.getComponentLocReport(capsule, errors);
        await this.writeLocReportFileToCapsule(output, capsule, errors);
        return { component: capsule.component, errors } as ComponentResult;
      })
    );

    return {
      artifacts: [
        {
          generatedBy: this.aspectId,
          name: this.name,
          globPatterns: [this.outputFileName],
        },
      ],
      componentsResults,
    };
  }

  private async getComponentLocReport(capsule: Capsule, errors: Error[]) {
    const files = capsule.component.filesystem.files;
    const supportedFiles = files.filter((file) =>
      ['ts', 'js', 'jsx', 'tsx', 'css', 'scss'].some((ext) =>
        file.path.endsWith(ext)
      )
    );
    for (const file of supportedFiles) {
      const fileExt = file.path.split('.').pop();
      const fileAbsPath = path.join(capsule.path, file.path);
      try {
        const fileContent = await fs.readFile(fileAbsPath, 'utf8');
        let stats = sloc(fileContent, fileExt);
        for (const i in sloc.keys) {
          const statsKey = sloc.keys[i];
          output[statsKey] += stats[statsKey];
        }
      } catch (err: any) {
        errors.push(err);
      }
    }
    return output;
  }

  private async writeLocReportFileToCapsule(output, capsule, errors) {
    try {
      await fs.writeFile(
        path.join(capsule.path, this.outputFileName),
        JSON.stringify(output, undefined, 4)
      );
    } catch (err: any) {
      errors.push(err);
    }
  }
}
