import { createSelector } from 'reselect';
import _ from 'lodash';

import { USER_AREA_STATE } from './reducer';
import { selectors as userSelectors } from '../user';
import { USER_ROLES } from '../../shared/constants';

const stateSelector = state => state.areas;

const userAreasSelector = state => stateSelector(state).userAreas;

const getUserAreaStateById = (state, userId) =>
  userAreasSelector(state)[userId] || USER_AREA_STATE;

const areUserAreasLoading = (state, userId) =>
  getUserAreaStateById(state, userId).loading;

const hasUserAreaError = (state, userId) =>
  getUserAreaStateById(state, userId).error;
const getUserAreas = (state, userId) =>
  getUserAreaStateById(state, userId).areas;

const getUserNestedAreas = (state, userId) => {
  const stateAreas = getUserAreas(state, userId);

  if (!stateAreas) {
    return [];
  }
  const role = userSelectors.getRole(state);

  let areas = [];
  if (role !== USER_ROLES.LEADER) {
    areas = _.cloneDeep(_.filter(stateAreas, a => !a.parentId));
  } else {
    areas = _.cloneDeep(stateAreas);
  }
  const getAreaChildren = area =>
    _.filter(stateAreas, a => a.parentId === area.id);
  const assignAreaChildren = area => {
    area.children = getAreaChildren(area);
    if (area.children && area.children.length > 0) {
      area.children.forEach(assignAreaChildren);
    }
  };

  areas.forEach(assignAreaChildren);
  // if (role === USER_ROLES.LEADER) {
  //   areas = _.map(_.groupBy(areas, a => a.parentId), group => _.first(group));
  // }
  return areas;
};
const getUserListNestedAreas = (state, userId) => {
  const stateAreas = getUserAreas(state, userId);

  if (!stateAreas) {
    return [];
  }
  const role = userSelectors.getRole(state);

  let areas = [];
  if (role !== USER_ROLES.LEADER) {
    areas = _.cloneDeep(_.filter(stateAreas, a => !a.parentId));
  } else {
    areas = _.cloneDeep(stateAreas);
  }
  const getAreaChildren = area =>
    _.filter(stateAreas, a => a.parentId === area.id);
  const assignAreaChildren = area => {
    area.children = getAreaChildren(area);
    if (area.children && area.children.length > 0) {
      area.children.forEach(assignAreaChildren);
    }
  };

  areas.forEach(assignAreaChildren);
  if (role === USER_ROLES.LEADER) {
    areas = _.map(_.groupBy(areas, a => a.parentId), group => _.first(group));
  }
  return areas;
};

const areasSelector = createSelector(stateSelector, state => state.areas);
const areAreasLoading = createSelector(areasSelector, state => state.loading);
const hasAreasError = createSelector(areasSelector, state => state.error);
const getAreas = createSelector(areasSelector, state => state.areas);
const getNestedAreas = createSelector(getAreas, stateAreas => {
  if (!stateAreas) {
    return [];
  }
  const areas = _.cloneDeep(_.filter(stateAreas, a => !a.parentId));
  const getAreaChildren = area =>
    _.filter(stateAreas, a => a.parentId === area.id);
  const assignAreaChildren = area => {
    area.children = getAreaChildren(area);
    if (area.children && area.children.length > 0) {
      area.children.forEach(assignAreaChildren);
    }
  };

  areas.forEach(assignAreaChildren);
  return areas;
});

export default {
  getUserAreaStateById,
  areUserAreasLoading,
  hasUserAreaError,
  getUserAreas,

  areasSelector,
  areAreasLoading,
  hasAreasError,
  getAreas,
  getNestedAreas,
  getUserNestedAreas,
  getUserListNestedAreas,
};
