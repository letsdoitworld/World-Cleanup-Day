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
} from '../../store/selectors';

import Component from './TrashPoints';
import { fetchDatasetUIIDAction } from '../../store/actions/app';
import {
    loadTrashPointsForMapAction,
    loadTrashPointsFromClusterAction,
} from '../../store/actions/trashPoints';
import { guestLogIn } from '../../store/actions/auth';

const selector = createStructuredSelector({
  trashPoints: getTrashPointsEntity,
  country: getUserCountry,
  isLoading,
  userCoord: getCoordUser,
  mapTrashPoints: getMapTrashPointsEntity,
  delta: showTrashPointsNewDeltaEntity,
  datasetUUIDSelector: datasetUUID,
  isAuthenticated,
});

const actions = {
  onFetchLocation: fetchUserLocation,
  onFetchDatasetUUIDAction: fetchDatasetUIIDAction,
  loadTrashPointsForMapAction,
  loadTrashPointsFromClusterAction,
  onGuestLogIn: guestLogIn,
};

export default connect(selector, actions)(Component);
