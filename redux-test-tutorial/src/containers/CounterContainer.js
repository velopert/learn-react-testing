import React from 'react';
import { connect } from 'react-redux';
import { increase, decrease } from '../modules/counter';
import Counter from '../components/Counter';

const CounterContainer = ({ number, increase, decrease }) => {
  return (
    <Counter number={number} onIncrease={increase} onDecrease={decrease} />
  );
};

const mapStateToProps = ({ counter }) => ({
  number: counter.number
});

const mapDispatchToProps = {
  increase,
  decrease
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CounterContainer);
