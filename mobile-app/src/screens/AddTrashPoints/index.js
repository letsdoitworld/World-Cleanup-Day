import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
    searchTrashPointsAction,
    clearTrashPointsAction
} from '../../store/actions/trashPoints';

import {
    getTrashPointsEntity,
    isLoading
} from '../../store/selectors';

import Component from './AddTrashPoints';

const selector = createStructuredSelector({
    trashPoints: getTrashPointsEntity,
    isLoading,
});

const actions = {
    onSearchTrashPointsAction: searchTrashPointsAction,
    onClearTrashPointsAction: clearTrashPointsAction,
};

export default connect(selector, actions)(Component);