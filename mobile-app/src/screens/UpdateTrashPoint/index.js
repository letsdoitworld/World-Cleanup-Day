import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Component from './UpdateTrashpoint';
import {
  deleteTrashPointImageAction,
  dismissSuccessUpdate,
  updateTrashPointAction,
  deleteTrashPointAction,
  getTrashPointDetailsAction,
  getTrashPointOriginAction,
} from '../../store/actions/trashPoints';
import {
  getCreateTrashPointEntity, getProfileEntity,
  isLoading,
} from '../../store/selectors';

const mapDispatch = {
  deleteTrashPointImageAction,
  updateTrashPointAction,
  getTrashPointDetailsAction,
  deleteTrashPointAction,
  dismissSuccessUpdate,
  getTrashPointOriginAction,
};
const selector = createStructuredSelector({
  createTrashPoint: getCreateTrashPointEntity,
  isLoading,
  profile: getProfileEntity,
});

export default connect(selector, mapDispatch)(Component);
