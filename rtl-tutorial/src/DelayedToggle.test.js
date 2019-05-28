import React from 'react';
import DelayedToggle from './DelayedToggle';
import {
  render,
  fireEvent,
  wait,
  waitForElement,
  waitForDomChange,
  waitForElementToBeRemoved
} from 'react-testing-library';

describe('<DelayedToggle />', () => {
  it('', () => {});
  // it('reveals text when toggle is ON', async () => {
  //   const { getByText } = render(<DelayedToggle />);
  //   const toggleButton = getByText('토글');
  //   fireEvent.click(toggleButton);
  //   await wait(() => getByText('야호!!')); // 콜백 안의 함수가 에러를 발생시키지 않을 때 까지 기다립니다.
  // });

  // it('toggles text ON/OFF', async () => {
  //   const { getByText } = render(<DelayedToggle />);
  //   const toggleButton = getByText('토글');
  //   fireEvent.click(toggleButton);
  //   const text = await waitForElement(() => getByText('ON'));
  //   expect(text).toHaveTextContent('ON');
  // });

  // it('changes something when button is clicked', async () => {
  //   const { getByText, container } = render(<DelayedToggle />);
  //   const toggleButton = getByText('토글');
  //   fireEvent.click(toggleButton);
  //   const mutations = await waitForDomChange({ container });
  //   expect(mutations).not.toHaveLength(0);
  // });

  // it('removes text when toggle is OFF', async () => {
  //   const { getByText, container } = render(<DelayedToggle />);
  //   const toggleButton = getByText('토글');
  //   fireEvent.click(toggleButton);
  //   await waitForDomChange({ container }); // ON 이 됨
  //   getByText('야호!!');
  //   fireEvent.click(toggleButton);
  //   await waitForElementToBeRemoved(() => getByText('야호!!'));
  // });
});
