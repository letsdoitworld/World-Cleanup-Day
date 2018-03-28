import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  loadEvent,
} from '../../store/actions/events';

import {
  getEventEntity,
  getErrorEvent,
} from '../../store/selectors';

import Component from './EventDetails';

const selector = createStructuredSelector({
  event: getEventEntity,
  error: getErrorEvent,
});

const actions = {
  onLoadEvent: loadEvent,
};

export default connect(selector, actions)(Component);
