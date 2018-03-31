import Component from './CreateMarker';

import {createStructuredSelector} from "reselect";
import {createTrashPointAction} from "../../store/actions/trashPoints";
import {connect} from "react-redux";

import {
    getCreateTrashPointEntity
} from '../../store/selectors';

import {
    isLoading,
} from '../../store/selectors';

const mapDispatch = {
    createTrashPointAction: createTrashPointAction
};
const selector = createStructuredSelector({
    createTrashPoint: getCreateTrashPointEntity,
    isLoading
});

export default connect(selector, mapDispatch)(Component);
