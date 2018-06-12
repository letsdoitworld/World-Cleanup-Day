import { createSelector } from 'reselect';

const stateSelector = state => state.teams;

const teamsSelector = createSelector(stateSelector, state => state.list);

const loadingSelector = createSelector(stateSelector, state => state.loading);


export default {
  teamsSelector,
  loadingSelector,
  teamSelector
};
