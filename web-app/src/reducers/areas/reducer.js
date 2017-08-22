import { combineReducers } from 'redux';
import _ from 'lodash';

import TYPES from './types';

export const USER_AREA_STATE = {
  loading: false,
  error: false,
  areas: [],
};
const userAreaReducer = (state = USER_AREA_STATE, action) => {
  switch (action.type) {
    case TYPES.GET_USER_AREAS:
      return { loading: true, error: false, areas: undefined };
    case TYPES.GET_USER_AREAS_SUCCESS:
      return {
        loading: false,
        error: false,
        areas: action.payload.areas,
      };
    case TYPES.GET_USER_AREAS_ERROR:
      return {
        areas: undefined,
        loading: false,
        error: action.payload.error,
      };
    case TYPES.ASSIGN_AREA_LEADER:
      
      if (!action.payload.area) {
        return state;
      }
      return {
        ...state,
        areas: [
          ...state.areas,
          {
            ...action.payload.area,
            leaderId: action.payload.userId,
          },
        ],
      };
    case TYPES.REMOVE_AREA_LEADER:
      
      return {
        ...state,
        areas: _.filter(state.areas, a => a.id !== action.payload.areaId),
      };
    default:
      return state;
  }
};
const userAreasReducer = (state = {}, action) => {
  switch (action.type) {
    case TYPES.GET_USER_AREAS:
    case TYPES.GET_USER_AREAS_SUCCESS:
    case TYPES.GET_USER_AREAS_ERROR:
    case TYPES.ASSIGN_AREA_LEADER:
    case TYPES.REMOVE_AREA_LEADER:
      return {
        ...state,
        [action.payload.userId]: userAreaReducer(
          state[action.payload.userId],
          action,
        ),
      };
    default:
      return state;
  }
};

export const AREAS_STATE = {
  loading: false,
  error: false,
  areas: undefined,
};
const areasReducer = (state = AREAS_STATE, action) => {
  switch (action.type) {
    case TYPES.GET_AREAS:
      return { ...AREAS_STATE };
    case TYPES.GET_AREAS_SUCCESS:
      return { loading: false, error: false, areas: action.payload.areas };
    case TYPES.GET_AREAS_ERROR:
      return { loading: false, error: action.payload.error, areas: undefined };
    case TYPES.ASSIGN_AREA_LEADER: {
      if (!state.areas) {
        return state;
      }
      const areaIndex = _.findIndex(
        state.areas,
        a => a.id === action.payload.areaId,
      );
      const newAreas = [
        ...state.areas.slice(0, areaIndex),
        {
          ...state.areas[areaIndex],
          leaderId: action.payload.userId,
        },
        ...state.areas.slice(areaIndex + 1),
      ];
      return {
        ...state,
        areas: newAreas,
      };
    }
    case TYPES.REMOVE_AREA_LEADER: {
      if (!state.areas) {
        return state;
      }
      const areaIndex = _.findIndex(
        state.areas,
        a => a.id === action.payload.areaId,
      );
      const areas = state.areas;
      const newArea = {
        ...areas[areaIndex],
        leaderId: undefined,
      };
      areas[areaIndex] = newArea;
      return {
        ...state,
        areas: [...areas],
      };
    }
    default:
      return state;
  }
};
export default combineReducers({
  userAreas: userAreasReducer,
  areas: areasReducer,
});
