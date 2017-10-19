import types from './types';

const INITIAL_STATE = [
  {
    id: 1,
    name: 'Test team 1',
    description: '',
  },
  {
    id: 2,
    name: 'Test team 2',
    description: '',
  },
  {
    id: 3,
    name: 'Test team 3',
    description: '',
  },
  {
    id: 4,
    name: 'Test team 4',
    description: '',
  },
];

export default (state = INITIAL_STATE, action) => {
  return state;
};
