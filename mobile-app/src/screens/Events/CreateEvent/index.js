import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { createEvent, createEventDone, createEventError } from '../../../store/actions/createEvent';

import { getCreateEventEntity, getCreateEventError } from '../../../store/selectors';

import Component from './AddPeopleToEvent';

const selector = createStructuredSelector({
    createEvent: getCreateEventEntity,
    errorEvent: getCreateEventError,
});

const actions = {
    requestCreateEvent: createEvent,
    requestCreateEventDone: createEventDone,
    requestCreateEventError: createEventError,
};

export default connect(selector, actions)(Component);