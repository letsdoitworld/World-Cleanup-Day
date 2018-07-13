import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  createEvent,
  createEventDone,
  createEventError,
} from '../../../store/actions/createEvent';

import {
  datasetUUID,
  getCreateEventEntity,
  getCreateEventLoading,
  getCreateEventError,
} from '../../../store/selectors';

import Component from './AddPeopleToEvent';
import { fetchDatasetUIIDAction } from '../../../store/actions/app';

const selector = createStructuredSelector({
  createdEvent: getCreateEventEntity,
  loadingEvent: getCreateEventLoading,
  errorEvent: getCreateEventError,
  datasetUUIDSelector: datasetUUID,
});

const actions = {
  requestCreateEvent: createEvent,
  requestCreateEventDone: createEventDone,
  requestCreateEventError: createEventError,
  onFetchDatasetUUIDAction: fetchDatasetUIIDAction,
};

export default connect(selector, actions)(Component);
