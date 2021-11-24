import {
  BuildTask,
  BuildContext,
  BuiltTaskResult,
  ComponentResult,
} from '@teambit/builder';
import path from 'path';
import fs from 'fs';

export class MyTask implements BuildTask {
  constructor(readonly aspectId: string) {}
  readonly name = 'MyTask';

  async execute(context: BuildContext): Promise<BuiltTaskResult> {
    // Prepare the component results array which will be used to report back the components proccessed
    // as well as any additional data regarding this build task execution
    const componentsResults: ComponentResult[] = [];
    // In most cases, only the 'seeder capsules' are the ones relevant for your build
    const capsules = context.capsuleNetwork.seedersCapsules;
    capsules.forEach((capsule) => {
      // Preprate an 'errors' array to report back of any erros during execution (this will be part of the 'Component Results' data)
      const errors: Error[] = [];
      // Each 'capsule' provides data regarding the component as well as the capsule itself
      const componentName = capsule.component.id.name;
      const capsuleDir = capsule.path;

      const artifactContent = `The component's name is: ${componentName}`;

      try {
        // Generate the artifact inside the capsule's diretory
        fs.writeFileSync(
          path.join(capsuleDir, 'output.my-artifact.txt'),
          artifactContent
        );
      } catch (err) {
        errors.push(err);
      }
      componentsResults.push({ component: capsule.component, errors });
    });

    return {
      artifacts: [
        {
          generatedBy: this.aspectId,
          name: this.name,
          // The glob pattern for artifacts to include in the comoponent version
          globPatterns: [`**/*.my-artifact.txt`],
        },
      ],
      componentsResults,
    };
  }
}
