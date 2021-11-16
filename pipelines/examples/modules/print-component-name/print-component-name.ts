import {
  BuildTask,
  BuildContext,
  BuiltTaskResult,
  ComponentResult,
} from '@teambit/builder';

export class PrintCmpNameTask implements BuildTask {
  constructor(readonly aspectId: string, readonly name: string) {}

  // eslint-disable-next-line class-methods-use-this
  async execute(context: BuildContext): Promise<BuiltTaskResult> {
    const componentsResults: ComponentResult[] = [];

    context.capsuleNetwork.seedersCapsules.forEach((capsule) => {
      console.log(
        `The current component name is: ${capsule.component.id.name}`
      );

      componentsResults.push({
        component: capsule.component,
        metadata: { customProp: capsule.component.id.name },
      });
    });
    return {
      componentsResults,
    };
  }
}
