import { createSelector } from 'reselect';

const teamsSelector = state => state.teams;
const getAllTeams = createSelector(teamsSelector, state => state.teams);
const getSelectedTeam = createSelector(teamsSelector, state => state.team);
const getTeamsLoading = createSelector(teamsSelector, state => state.loading);
const getSelectedTeamLoading = createSelector(teamsSelector, state => state.teamLoading);

export default {
  getAllTeams,
  getTeamsLoading,
  getSelectedTeam,
  getSelectedTeamLoading
};
