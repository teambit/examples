import {
  Tester,
  CallbackFn,
  TesterContext,
  Tests,
  ComponentPatternsMap,
} from '@teambit/tester';
import { flatten } from 'lodash';
import minimatch from 'minimatch';
import { ComponentMap, ComponentID } from '@teambit/component';
import Mocha from 'mocha';

export class MyMocha implements Tester {
  constructor(readonly id: string) {}

  async test(context: TesterContext): Promise<Tests> {
    const mocha = new Mocha();
    context.components[0].filesystem.files[0].
    const testFilePaths = this.specsPerComponentToFlatArray(context.patterns)
    testFilePaths.forEach((testFile) => {
      console.log('testFile: ', testFile)
      // mocha.addFile()
    })

    return { components: [], errors: [] };
  }

  version() {
    return '1.0.0';
  }
    /**
   * the data from the tester aspect is a map of Component object and spec-paths.
   * For Mocha test API, we only need an array of spec files and we don't need their component object.
   */
     private specsPerComponentToFlatArray(
      patterns: ComponentPatternsMap
    ): string[] {
      return flatten(
        patterns.toArray().map(([, pattern]) => pattern.map((p) => p.path))
      );
    }

     /**
   * we lost the relation between the components and the files to tests by calling `this.specsPerComponentToFlatArray()`.
   * it was needed for the Jest tester API in order to run on spec files of all components at once for performance optimization.
   * here, we match the Jest results with the corresponding components.
   */
  private mapTestsToComponent(
    testerContext: TesterContext,
    testResult: any[]
  ) {
    return ComponentMap.as(testerContext.components, (component) => {
      const componentSpecFiles = testerContext.patterns.get(component);
      if (!componentSpecFiles) return undefined;
      const [, specs] = componentSpecFiles;
      return testResult.filter((test) => {
        return (
          specs.filter((pattern) => minimatch(test.testFilePath, pattern.path))
            .length > 0
        );
      });
    });
  }
}
