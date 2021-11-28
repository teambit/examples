import React, { useContext } from 'react';
import { UIRuntime } from '@teambit/ui';
import {
  ComponentUI,
  ComponentAspect,
  // ComponentContext,
} from '@teambit/component';
import { useQuery } from '@apollo/client';
import { AspectLocStatsAspect } from './aspect-loc-stats.aspect';

const MyComp = () => {
  // const component = useContext(ComponentContext);
  return <div>...</div>;
};

export class AspectLocStatsUI {
  static dependencies = [ComponentAspect];
  static runtime = UIRuntime;
  static async provider([component]: [ComponentUI]) {
    component.registerRoute({
      children: <MyComp />,
      path: '~toc',
    });
    component.registerNavigation({
      href: '~toc',
      children: 'TOC',
    });
    return new AspectLocStatsUI();
  }
}

AspectLocStatsAspect.addRuntime(AspectLocStatsUI);
