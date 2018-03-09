import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { createEvent } from '../../../store/actions/create-event-action';

import { getCreateEventEntity } from '../../../store/selectors';

import Component from './AddPeopleToEvent';

const selector = createStructuredSelector({
    createEvent: getCreateEventEntity,
});

const actions = {
    requestCreateEvent: createEvent,
};

export default connect(selector, actions)(Component);