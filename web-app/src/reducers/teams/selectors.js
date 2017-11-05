import { createSelector } from 'reselect';

const teamsSelector = state => state.teams;
const getAllTeams = createSelector(teamsSelector, state => state.teams);
const getTeamsLoading = createSelector(teamsSelector, state => state.loading);

export default {
  getAllTeams,
  getTeamsLoading,
};
