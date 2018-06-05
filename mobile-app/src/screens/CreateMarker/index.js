import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Component from './CreateMarker';
import { createTrashPointAction } from '../../store/actions/trashPoints';
import { getCreateTrashPointEntity, isLoading } from '../../store/selectors';

const mapDispatch = {
  createTrashPointAction,
};
const selector = createStructuredSelector({
  createTrashPoint: getCreateTrashPointEntity,
  isLoading,
});

export default connect(selector, mapDispatch)(Component);
