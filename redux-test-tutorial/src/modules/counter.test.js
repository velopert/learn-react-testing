import counter, * as actions from './counter';

describe('counter module', () => {
  describe('action creators', () => {
    it('should create INCREASE action', () => {
      expect(actions.increase()).toEqual({ type: 'counter/INCREASE' });
    });
    it('should create DECREASE action', () => {
      expect(actions.decrease()).toEqual({ type: 'counter/DECREASE' });
    });
  });
  describe('reducer', () => {
    const initialState = {
      number: 0
    };
    it('should have initialState', () => {
      const state = counter(undefined, {});
      expect(state).toEqual(initialState);
    });
    it('should handle INCREASE action', () => {
      const state = counter(initialState, actions.increase());
      expect(state.number).toBe(1);
    });
    it('should handle DECREASE action', () => {
      const state = counter(initialState, actions.decrease());
      expect(state.number).toBe(-1);
    });
  });
});
