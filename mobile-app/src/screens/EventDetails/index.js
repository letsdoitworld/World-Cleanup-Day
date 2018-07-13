import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  loadEvent,
  cleanEvent,
  joinEvent,
  deleteEvent,
} from '../../store/actions/events';

import {
  getEventEntity,
  getErrorEvent,
  getProfileEntity,
} from '../../store/selectors';

import Component from './EventDetails';
import { guestLogIn } from '../../store/actions/auth';

const selector = createStructuredSelector({
  profile: getProfileEntity,
  event: getEventEntity,
  error: getErrorEvent,
});

const actions = {
  onLoadEvent: loadEvent,
  onCleanEvent: cleanEvent,
  onJoinEvent: joinEvent,
  onDeleteEvent: deleteEvent,
  onGuestLogIn: guestLogIn,
};

export default connect(selector, actions)(Component);
