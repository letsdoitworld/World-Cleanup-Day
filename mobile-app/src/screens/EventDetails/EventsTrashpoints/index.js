import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  loadEvent,
} from '../../../store/actions/events';

import {
  getEventsTrashpoints,
  getProfileEntity,
} from '../../../store/selectors';

import Component from './EventsTrashpoints';

const selector = createStructuredSelector({
  profile: getProfileEntity,
  trashpoints: getEventsTrashpoints,
});

const actions = {
  onLoadEvent: loadEvent,
};

export default connect(selector, actions)(Component);
