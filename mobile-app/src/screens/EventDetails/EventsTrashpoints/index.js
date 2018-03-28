import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  loadEvent,
} from '../../../store/actions/events';

import {
  getEventsTrashpoints,
} from '../../../store/selectors';

import Component from './EventsTrashpoints';

const selector = createStructuredSelector({
  trashpoints: getEventsTrashpoints,
});

const actions = {
  onLoadEvent: loadEvent,
};

export default connect(selector, actions)(Component);
