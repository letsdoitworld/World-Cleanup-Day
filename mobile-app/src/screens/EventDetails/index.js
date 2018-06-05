import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  loadEvent,
  cleanEvent,
} from '../../store/actions/events';

import {
  getEventEntity,
  getErrorEvent,
  getProfileEntity,
} from '../../store/selectors';

import Component from './EventDetails';

const selector = createStructuredSelector({
  profile: getProfileEntity,
  event: getEventEntity,
  error: getErrorEvent,
});

const actions = {
  onLoadEvent: loadEvent,
  onCleanEvent: cleanEvent,
};

export default connect(selector, actions)(Component);
