import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { searchEventsAction, clearEventsAction } from '../../store/actions/events';

import { getEventsEntity, getCoordUser } from '../../store/selectors';

import Component from './Events';

const selector = createStructuredSelector({
  events: getEventsEntity,
  userCoord: getCoordUser,
});

const actions = {
  onSearchEventsAction: searchEventsAction,
  onClearEventsAction: clearEventsAction,
};

export default connect(selector, actions)(Component);
