import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import Counter from './Counter';

describe('<Counter />', () => {
  const setup = (props = {}) => {
    const initialProps = { number: 0 };
    const utils = render(<Counter {...initialProps} {...props} />);
    const number = utils.getByText(
      (props.number || initialProps.number).toString()
    );
    const plusButton = utils.getByText('+1');
    const minusButton = utils.getByText('-1');
    return {
      ...utils,
      number,
      plusButton,
      minusButton
    };
  };
  it('should have number and two buttons', () => {
    const { number, plusButton, minusButton } = setup();
    expect(number).toBeTruthy();
    expect(plusButton).toBeTruthy();
    expect(minusButton).toBeTruthy();
  });
  it('should render number props', () => {
    const { number } = setup({ number: 7 });
    expect(number).toHaveTextContent('7');
  });
  it('should call onIncrease and onDecrease', () => {
    const onIncrease = jest.fn();
    const onDecrease = jest.fn();
    const { plusButton, minusButton } = setup({
      onIncrease,
      onDecrease
    });
    fireEvent.click(plusButton);
    expect(onIncrease).toBeCalled();
    fireEvent.click(minusButton);
    expect(onDecrease).toBeCalled();
  });
});
