import React from 'react';

export type TextProps = {
  /**
   * a text to be rendered in the component.
   */
  text: string
};

export function Text({ text }: TextProps) {
  return (
    <div>
      {text}
    </div>
  );
}
