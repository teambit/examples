import React, { ReactNode } from 'react';

export type MyComponentProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;
};

export function MyComponent({ children }: MyComponentProps) {
  return (
    <div>
      {children}
    </div>
  );
}
