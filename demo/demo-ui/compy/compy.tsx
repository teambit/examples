import React, { ReactNode } from 'react';

export type CompyProps = {
  /**
   * a node to be rendered in the special component.
   */
  children?: ReactNode;
};

export function Compy({ children }: CompyProps) {
  return (
    <div>
      {children}
    </div>
  );
}
