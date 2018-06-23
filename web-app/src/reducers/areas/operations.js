import ApiService from '../../services/Api';
import actions from './actions';
import selectors from './selectors';
import { selectors as userSels } from '../../reducers/user';
import {
  actions as errActions,
} from '../../reducers/error';
import { API_ENDPOINTS } from '../../shared/constants';

const getUserAreas = ({ userId }) => async (dispatch, getState) => {
  const authUser = userSels.getProfile(getState());
  const isOwnUser = authUser && authUser.id === userId;
  dispatch(actions.getUserAreas({ userId }));
  let response = await ApiService.get(`/areas/user/${userId}`);
  if (!response) {
    response = await ApiService.get(`/areas/user/${userId}`);
    dispatch(actions.getUserAreasError({ userId, error: true }));
    return;
  }
  const areas = response.data;
  dispatch(actions.getUserAreasSuccess({ userId, areas }));
  return areas;
};
const getAreas = () => async dispatch => {
  try {
    dispatch(actions.getAreas());
    const response = await ApiService.get('/areas');
    if (!response) {
      dispatch(actions.getAreasError({ error: true }));
      dispatch(errActions.setErrorMessage('Failed to load areas'));
      return;
    }
    const areas = response.data;
      // get the other area
    /*
    const otherTraspointsResponse = await ApiService.get(
      'areas/-/trashpoints?pageSize=10&pageNumber=1',
    );
    if (otherTraspointsResponse && otherTraspointsResponse.data) {
      areas.push({
        id: '-',
        name: 'Other',
        trashCount: otherTraspointsResponse.data.total,
        // TODO add other count
      });
    }
    */
    dispatch(actions.getAreasSuccess({ areas }));
  } catch (ex) {
    console.log(ex);
  }
};

const assignAreaLeader = ({ areaId, userId }) => async (dispatch, getState) => {
  const response = await ApiService.put(
    `/areas/${areaId}/leader/${userId}`,
    {},
    { withToken: true },
    {
      'Content-Type': 'application/json',
    },
  );
  if (response) {
    const areas = selectors.getAreas(getState());
    const area = (areas || []).find(a => a.id === areaId);
    dispatch(actions.assignAreaLeader({ areaId, area, userId }));
    const userRes = await ApiService.get(API_ENDPOINTS.FETCH_USER_BY_ID(userId));
    if (!userRes) {
      dispatch({ type: 'GET_USER_ERROR' });
    } else {
      dispatch({
        type: 'GET_USER_SUCCESS',
        payload: { user: userRes.data },
      });
    }
  }
};

const removeAreaLeader = ({ areaId, userId }) => async dispatch => {
  const response = await ApiService.delete(`/areas/${areaId}/leader/${userId}`);
  if (response) {
    dispatch(actions.removeAreaLeader({ areaId, userId }));
    const userRes = await ApiService.get(API_ENDPOINTS.FETCH_USER_BY_ID(userId));
    if (!userRes) {
      dispatch({ type: 'GET_USER_ERROR' });
    } else {
      dispatch({
        type: 'GET_USER_SUCCESS',
        payload: { user: userRes.data },
      });
    }
  }
};
export default {
  getUserAreas,
  getAreas,
  assignAreaLeader,
  removeAreaLeader,
};
