export const FETCH_TEAMS = 'teams/FETCH_TEAMS';
export const fetchTeams = search => ({
  type: FETCH_TEAMS,
  payload: search,
});

export const FETCH_TEAMS_SUCCESS = 'teams/FETCH_TEAMS_SUCCESS';
export const fetchTeamsDone = teams => ({
  type: FETCH_TEAMS_SUCCESS,
  payload: teams,
});

export const FETCH_TEAMS_ERROR = 'teams/FETCH_TEAMS_ERROR';
export const fetchTeamsError = error => ({
  type: FETCH_TEAMS_ERROR,
  payload: error,
});

export const FETCH_TEAM = 'teams/FETCH_TEAM';
export const fetchTeam = teamId => ({
  type: FETCH_TEAM,
  payload: teamId,
});

export const FETCH_TEAM_SUCCESS = 'teams/FETCH_TEAM_SUCCESS';
export const fetchTeamDone = team => ({
  type: FETCH_TEAM_SUCCESS,
  payload: team,
});

export const FETCH_TEAM_ERROR = 'teams/FETCH_TEAM_ERROR';
export const fetchTeamError = error => ({
  type: FETCH_TEAM_ERROR,
  payload: error,
});
