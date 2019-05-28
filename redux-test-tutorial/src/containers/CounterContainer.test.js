import React from 'react';
import renderWithRedux from '../renderWithRedux';
import CounterContainer from './CounterContainer';
import { fireEvent } from 'react-testing-library';

describe('<CounterContainer />', () => {
  it('shows the default number 0', () => {
    const { getByText } = renderWithRedux(<CounterContainer />);
    getByText('0');
  });
  it('should increase when +1 is clicked', () => {
    const { getByText } = renderWithRedux(<CounterContainer />);
    fireEvent.click(getByText('+1'));
    getByText('1');
  });
  it('should decrease when -1 is clicked', () => {
    const { getByText } = renderWithRedux(<CounterContainer />);
    const number = getByText('0');
    fireEvent.click(getByText('-1'));
    expect(number).toHaveTextContent('-1');
  });
});
