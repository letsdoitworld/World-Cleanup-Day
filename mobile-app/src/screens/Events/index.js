import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';

import {searchEventsAction, clearEventsAction} from '../../store/actions/events';

import {getEventsEntity, isAuthenticated,} from '../../store/selectors';

import Component from './Events';
import {guestLogIn} from "../../store/actions/auth";

const selector = createStructuredSelector({
    events: getEventsEntity,
    isAuthenticated,
});

const actions = {
    onSearchEventsAction: searchEventsAction,
    onClearEventsAction: clearEventsAction,
    onGuestLogIn: guestLogIn,
};

export default connect(selector, actions)(Component);
