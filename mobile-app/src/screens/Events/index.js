import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';

import {
    clearEventsAction,
    loadEventsForMapAction,
    loadEventsFromClusterAction,
    searchEventsAction,
} from '../../store/actions/events';

import {fetchDatasetUIIDAction,} from '../../store/actions/app';

import {
    datasetUUID,
    errorHandle,
    getCoordUser,
    getEventsEntity,
    getMapEventsEntity,
    isAuthenticated,
    isLoading,
    isPrivateProfile,
    showNewDeltaEntity,
} from '../../store/selectors';

import Component from './Events';
import {guestLogIn} from "../../store/actions/auth";

const selector = createStructuredSelector({
    events: getEventsEntity,
    userCoord: getCoordUser,
    mapEvents: getMapEventsEntity,
    delta: showNewDeltaEntity,
    error: errorHandle,
    isAuthenticated,
    isLoading,
    isPrivateProfile,
    datasetUUIDSelector: datasetUUID,
});

const actions = {
    onSearchEventsAction: searchEventsAction,
    onClearEventsAction: clearEventsAction,
    onGuestLogIn: guestLogIn,
    onLoadMapEventsAction: loadEventsForMapAction,
    onFetchDatasetUUIDAction: fetchDatasetUIIDAction,
    onLoadEventsFromClusterAction: loadEventsFromClusterAction,
};

export default connect(selector, actions)(Component);
