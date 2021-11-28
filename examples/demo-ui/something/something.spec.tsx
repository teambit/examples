import React from 'react';
import { render } from '@testing-library/react';
import { BasicSomething } from './something.composition';

it('should render with the correct text', () => {
  const { getByText } = render(<BasicSomething />);
  const rendered = getByText('hello from Something');
  expect(rendered).toBeTruthy();
});
