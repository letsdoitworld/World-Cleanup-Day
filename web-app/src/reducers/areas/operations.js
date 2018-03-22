import ApiService from '../../services/Api';
import actions from './actions';
import selectors from './selectors';
import { selectors as userSels } from '../../reducers/user';

const getUserAreas = ({ userId }) => async (dispatch, getState) => {
  const authUser = userSels.getProfile(getState());
  const isOwnUser = authUser && authUser.id === userId;
  dispatch(actions.getUserAreas({ userId }));
  let response = await ApiService.get(
    isOwnUser ? '/areas/user' : `/areas/user/${userId}`,
  );
  if (!response) {
    response = await ApiService.get(
      isOwnUser ? '/areas/user' : `/areas/user/${userId}`,
    );
    dispatch(actions.getUserAreasError({ userId, error: true }));
    return;
  }
  const areas = response.data;
  dispatch(actions.getUserAreasSuccess({ userId, areas }));
  return areas;
};
const getAreas = () => async dispatch => {
  dispatch(actions.getAreas());
  let response = await ApiService.get('/areas');
  if (!response) {
    response = await ApiService.get('/areas');
    if (!response) {
      dispatch(actions.getAreasError({ error: true }));
      return;
    }
  }
  const areas = response.data;
  try {
    // get the other area
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
  } catch (ex) {
    console.log(ex);
  }
  dispatch(actions.getAreasSuccess({ areas }));
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
  }
};

const removeAreaLeader = ({ areaId, userId }) => async dispatch => {
  const response = await ApiService.delete(`/areas/${areaId}/leader`);
  if (response) {
    dispatch(actions.removeAreaLeader({ areaId, userId }));
  }
};
export default {
  getUserAreas,
  getAreas,
  assignAreaLeader,
  removeAreaLeader,
};
