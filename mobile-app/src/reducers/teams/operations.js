import Api from '../../services/Api';
import userActions from '../user/actions';
import actions from './actions';
import { handleSentryError } from '../../shared/helpers';

const updateTeam = profile => async (dispatch) => {
  dispatch(userActions.updateProfile());

  try {
    const response = await Api.put('/me/join-team', profile);
    if (!response || !response.data) {
      throw { error: 'Could not not read response data' };
    }
    dispatch(userActions.updateProfileDone(response.data));
    return response.data;
  } catch (ex) {
    handleSentryError(ex);
    dispatch(userActions.updateProfileError(ex));
  }
};

const getTeams = () => async (dispatch) => {
  dispatch(actions.fetchTeams());

  try {
    const response = await Api.get('/teams');

    dispatch(actions.fetchTeamsSuccess(response.data));
    return response.data;
  } catch (ex) {
    handleSentryError(ex);
    dispatch(actions.fetchTeamsError(ex));
    throw ex;
  }
};

export default {
  updateTeam,
  getTeams,
};
