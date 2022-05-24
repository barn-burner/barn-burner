import React from 'react';
import { render } from '@testing-library/react';
import Sample from '../Sample';

describe('<Sample /> spec', () => {
  it('Renders normally', () => {
    const { asFragment } = render(<Sample>test</Sample>);
    expect(asFragment()).toMatchSnapshot();
  });

  it('Renders with className', () => {
    const { asFragment, getByText } = render(<Sample className='testClass'>test</Sample>);
    expect(getByText('test')).toHaveClass('testClass');
    expect(asFragment()).toMatchSnapshot();
  });
});