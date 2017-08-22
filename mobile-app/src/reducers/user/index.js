export { default } from './reducers';

export { default as operations } from './operations';
export { default as selectors } from './selectors';
export { default as types } from './types';
export const actions = {
  setCachedLocation: () => ({ type: 'TEST_ACTION' }),
  setUserLocation: () => ({ type: 'TEST_ACTION' }),
};
