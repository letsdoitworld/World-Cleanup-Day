import { createSelector } from 'reselect';

const getState = state => state.toJS();

const teamsSelector = createSelector(getState, state => state.teams);

export const getTeams = createSelector(
  teamsSelector,
  teams => teams.teams,
);

export const getLoader = createSelector(
  teamsSelector,
  teams => teams.loading,
);

export const getTeam = createSelector(
  teamsSelector,
  teams => teams.team,
);
