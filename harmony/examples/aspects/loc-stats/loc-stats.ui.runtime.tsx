import React, { useContext } from 'react';
import { UIRuntime } from '@teambit/ui';
import {
  ComponentUI,
  ComponentAspect,
  // ComponentContext,
} from '@teambit/component';
import { useQuery } from '@apollo/client';
import { LocStatsAspect } from './loc-stats.aspect';

const MyComp = () => {
  // const component = useContext(ComponentContext);
  return <div>...</div>;
};

export class LocStatsUI {
  static dependencies = [ComponentAspect];
  static runtime = UIRuntime;
  static async provider([component]: [ComponentUI]) {
    component.registerRoute({
      children: <MyComp />,
      path: '~loc',
    });
    component.registerNavigation({
      href: '~loc',
      children: 'LOC Stats',
    });
    return new LocStatsUI();
  }
}

LocStatsAspect.addRuntime(LocStatsUI);
