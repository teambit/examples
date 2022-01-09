import React, { ReactNode } from 'react';

export type MyReactComponentProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;
};

export function MyReactComponent({ children }: MyReactComponentProps) {
  return (
    <div>
      {children}
    </div>
  );
}
