import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  fetchUserLocation,
  changeUserLocation,
} from '../../store/actions/locations';

import {
  datasetUUID,
  getCoordUser,
  getMapTrashPointsEntity,
  getTrashPointsEntity,
  getUserCountry,
  isAuthenticated,
  isLoading,
  showTrashPointsNewDeltaEntity,
  errorHandle,
  noTrashPoints,
  getCreateTrashPointEntity,
} from '../../store/selectors';

import Component from './TrashPoints';
import { fetchDatasetUIIDAction } from '../../store/actions/app';
import {
  loadTrashPointsForMapAction,
  loadTrashPointsFromClusterAction,
} from '../../store/actions/trashPoints';
import { guestLogIn } from '../../store/actions/auth';
import { setErrorMessage } from '../../store/actions/error';

const selector = createStructuredSelector({
  trashPoints: getTrashPointsEntity,
  country: getUserCountry,
  isLoading,
  userCoord: getCoordUser,
  mapTrashPoints: getMapTrashPointsEntity,
  delta: showTrashPointsNewDeltaEntity,
  datasetUUIDSelector: datasetUUID,
  isAuthenticated,
  appError: errorHandle,
  isEmpty: noTrashPoints,
  createTrashPoint: getCreateTrashPointEntity,
});

const actions = {
  onFetchLocation: fetchUserLocation,
  onFetchDatasetUUIDAction: fetchDatasetUIIDAction,
  loadTrashPointsForMapAction,
  loadTrashPointsFromClusterAction,
  onGuestLogIn: guestLogIn,
  onSetError: setErrorMessage,
  onChangeUserLocation: changeUserLocation,
};

export default connect(selector, actions)(Component);
