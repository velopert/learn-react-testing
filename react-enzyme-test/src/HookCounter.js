import React, { useState, useCallback } from 'react';

const HookCounter = () => {
  const [number, setNumber] = useState(0);
  const onIncrease = useCallback(() => {
    setNumber(number + 1);
  }, [number]);
  const onDecrease = useCallback(() => {
    setNumber(number - 1);
  }, [number]);

  return (
    <div>
      <h2>{number}</h2>
      <button onClick={onIncrease}>+1</button>
      <button onClick={onDecrease}>-1</button>
    </div>
  );
};

export default HookCounter;
