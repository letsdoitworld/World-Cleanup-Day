import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { fetchUserLocation } from '../../store/actions/locations';

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
  isConnected,
} from '../../store/selectors';

import Component from './TrashPoints';
import { fetchDatasetUIIDAction } from '../../store/actions/app';
import {
  loadTrashPointsForMapAction,
  loadTrashPointsFromClusterAction,
  createTrashPointOfflineAction,
} from '../../store/actions/trashPoints';
import { guestLogIn } from '../../store/actions/auth';
import { setErrorMessage } from '../../store/actions/error';
import { withNetworkGuard } from '../../services/Network';
import { compose } from 'recompose';

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
  isConnected,
});

const actions = {
  onFetchLocation: fetchUserLocation,
  onFetchDatasetUUIDAction: fetchDatasetUIIDAction,
  loadTrashPointsForMapAction,
  loadTrashPointsFromClusterAction,
  createTrashPointOfflineAction,
  onGuestLogIn: guestLogIn,
  onSetError: setErrorMessage,
};

export default compose(
  connect(selector, actions),
)(Component);
