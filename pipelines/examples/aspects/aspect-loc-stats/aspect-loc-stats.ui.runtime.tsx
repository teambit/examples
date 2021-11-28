import React, { useContext } from 'react';
import { UIRuntime } from '@teambit/ui';
import {
  ComponentUI,
  ComponentAspect,
  ComponentContext,
} from '@teambit/component';
import { AspectLocStatsAspect } from './aspect-loc-stats.aspect';

const MyComp = () => {
  const component = useContext(ComponentContext);
  return <div>compoennt package {component.packageName}</div>;
};

export class AspectLocStatsUI {
  static dependencies = [ComponentAspect];
  static runtime = UIRuntime;
  static async provider([component]: [ComponentUI]) {
    component.registerRoute({
      children: <MyComp />,
      path: '~component-name',
    });
    component.registerNavigation({
      href: '~component-name',
      children: 'Component Name',
    });
    return new AspectLocStatsUI();
  }
}

AspectLocStatsAspect.addRuntime(AspectLocStatsUI);
