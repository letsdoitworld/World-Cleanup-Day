import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';

import {
    searchEventsAction,
    clearEventsAction,
    loadEventsForMapAction,
} from '../../store/actions/events';

import {
    fetchDatasetUIIDAction,
} from '../../store/actions/app';

import {
    getEventsEntity,
    getCoordUser,
    isAuthenticated,
    isLoading,
    isPrivateProfile,
    getMapEventsEntity,
    datasetUUID,
} from '../../store/selectors';

import Component from './Events';
import {guestLogIn} from "../../store/actions/auth";

const selector = createStructuredSelector({
    events: getEventsEntity,
    userCoord: getCoordUser,
    mapEvents: getMapEventsEntity,
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
};

export default connect(selector, actions)(Component);
