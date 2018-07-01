import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Component from './CreateMarker';
import { createTrashPointAction, createTrashPointOfflineAction } from '../../store/actions/trashPoints';
import { getCreateTrashPointEntity, isLoading } from '../../store/selectors';
import { getProfileTeam } from '../../store/selectors';

const mapDispatch = {
  createTrashPointAction,
  createTrashPointOfflineAction
};
const selector = createStructuredSelector({
  createTrashPoint: getCreateTrashPointEntity,
  isLoading,
  teamId: getProfileTeam,
});

export default connect(selector, mapDispatch)(Component);
