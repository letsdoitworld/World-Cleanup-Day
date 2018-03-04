import { createSelector } from 'reselect';

const stateSelector = state => state.teams;

const teamsSelector = createSelector(stateSelector, state => {
  return state;
});

export default {
  teamsSelector,
};
