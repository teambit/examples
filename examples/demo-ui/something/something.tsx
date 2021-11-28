import React from 'react';

export type SomethingProps = {
  /**
   * a text to be rendered in the component.
   */
  text: string
};

export function Something({ text }: SomethingProps) {
  return (
    <div>
      {text}
    </div>
  );
}
