import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';

import {
    searchEventsAction,
    clearEventsAction,
    loadEventsForMapAction,
} from '../../store/actions/events';

import {
    getEventsEntity,
    getCoordUser,
    isAuthenticated,
    isLoading,
    getMapEventsEntity
} from '../../store/selectors';

import Component from './Events';
import {guestLogIn} from "../../store/actions/auth";

const selector = createStructuredSelector({
    events: getEventsEntity,
    userCoord: getCoordUser,
    mapEvents: getMapEventsEntity,
    isAuthenticated,
    isLoading,
});

const actions = {
    onSearchEventsAction: searchEventsAction,
    onClearEventsAction: clearEventsAction,
    onGuestLogIn: guestLogIn,
    onLoadMapEventsAction: loadEventsForMapAction,
};

export default connect(selector, actions)(Component);
