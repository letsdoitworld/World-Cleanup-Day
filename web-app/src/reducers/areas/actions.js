import TYPES from './types';

const getUserAreas = ({ userId }) => ({
  type: TYPES.GET_USER_AREAS,
  payload: { userId },
});
const getUserAreasSuccess = ({ userId, areas }) => ({
  type: TYPES.GET_USER_AREAS_SUCCESS,
  payload: {
    userId,
    areas,
  },
});
const getUserAreasError = ({ userId, error }) => ({
  type: TYPES.GET_USER_AREAS_ERROR,
  payload: {
    userId,
    error,
  },
});

const getAreas = () => ({ type: TYPES.GET_AREAS });

const searchAreas = () => ({ type: TYPES.SEARCH_AREAS });

const getAreasSuccess = ({ areas }) => ({
  type: TYPES.GET_AREAS_SUCCESS,
  payload: { areas },
});
const getAreasError = ({ error }) => ({
  type: TYPES.GET_AREAS_ERROR,
  payload: { error },
});

const assignAreaLeader = ({ userId, area, areaId }) => ({
  type: TYPES.ASSIGN_AREA_LEADER,
  payload: { userId, areaId, area },
});

const removeAreaLeader = ({ areaId, userId }) => ({
  type: TYPES.REMOVE_AREA_LEADER,
  payload: { areaId, userId },
});
export default {
  getUserAreas,
  getUserAreasSuccess,
  getUserAreasError,

  getAreas,
  searchAreas,
  getAreasSuccess,
  getAreasError,

  assignAreaLeader,
  removeAreaLeader,
};
