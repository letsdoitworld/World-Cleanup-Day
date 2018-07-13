import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  clearEventsAction,
  loadEventsForMapAction,
  loadEventsFromClusterAction,
  searchEventsAction,
  changeViewPortAction,
  changeRegionAction,
} from '../../store/actions/events';

import { fetchDatasetUIIDAction } from '../../store/actions/app';
import { setErrorMessage } from '../../store/actions/error';

import {
  datasetUUID,
  errorHandle,
  getCoordUser,
  getEventsEntity,
  getEmptyEventsEntity,
  getMapEventsEntity,
  isAuthenticated,
  isLoading,
  isPrivateProfile,
  showNewDeltaEntity,
  noEvents,
  updatedViewPort,
  updatedRegion,
} from '../../store/selectors';
import { guestLogIn } from '../../store/actions/auth';

import Component from './Events';
import { changeUserLocation } from '../../store/actions/locations';

const selector = createStructuredSelector({
  events: getEventsEntity,
  emptyEvents: getEmptyEventsEntity,
  userCoord: getCoordUser,
  mapEvents: getMapEventsEntity,
  delta: showNewDeltaEntity,
  error: errorHandle,
  isAuthenticated,
  isLoading,
  isPrivateProfile,
  datasetUUIDSelector: datasetUUID,
  isEmpty: noEvents,
  actualViewPort: updatedViewPort,
  actualRegion: updatedRegion,
});

const actions = {
  onSearchEventsAction: searchEventsAction,
  onClearEventsAction: clearEventsAction,
  onLoadMapEventsAction: loadEventsForMapAction,
  onFetchDatasetUUIDAction: fetchDatasetUIIDAction,
  onLoadEventsFromClusterAction: loadEventsFromClusterAction,
  onSetError: setErrorMessage,
  onGuestLogIn: guestLogIn,
  onViewPortUpdate: changeViewPortAction,
  onChangeRegion: changeRegionAction,
  onChangeUserLocation: changeUserLocation,
};

export default connect(selector, actions)(Component);
