import actions from './actions';

const updateTeam = profile => async (dispatch) => {
  try {
    const response = await Api.put('/me/join-team', profile);
    if (!response || !response.data) {
      throw { error: 'Could not not read response data' };
    }
    dispatch(actions.updateProfileDone(response.data));
    return response.data;
  } catch (ex) {
    handleSentryError(ex);
    dispatch(actions.updateProfileError(ex));
  }
};


export default {
  updateTeam,
};
