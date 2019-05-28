import React from 'react';
import { render } from 'react-testing-library';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './modules';

function renderWithRedux(ui, initialState) {
  const store = createStore(rootReducer, initialState);
  const utils = render(<Provider store={store}>{ui}</Provider>);
  return {
    ...utils,
    store
  };
}

export default renderWithRedux;
