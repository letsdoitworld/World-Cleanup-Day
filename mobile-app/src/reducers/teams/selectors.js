import { createSelector } from 'reselect';

const stateSelector = state => state.teams;

const teamsSelector = createSelector(stateSelector, state => state.list);

const loadingSelector = createSelector(stateSelector, state => state.loading);

const teamSelector = createSelector(stateSelector, state => state.team);

export default {
  teamsSelector,
  loadingSelector,
  teamSelector
};
