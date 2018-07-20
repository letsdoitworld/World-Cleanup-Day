import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Component from './CreateMarker';
import {
  createTrashPointAction,
  dismissSuccessUpdate,
  getTrashPointDetailsAction,
  getTrashPointOriginAction,
} from '../../store/actions/trashPoints';
import {
  getCreateTrashPointEntity,
  isLoading,
  getProfileTeam,
} from '../../store/selectors';

const mapDispatch = {
  createTrashPointAction,
  getTrashPointDetailsAction,
  getTrashPointOriginAction,
  dismissSuccessUpdate,
};
const selector = createStructuredSelector({
  createTrashPoint: getCreateTrashPointEntity,
  isLoading,
  teamId: getProfileTeam,
});

export default connect(selector, mapDispatch)(Component);
