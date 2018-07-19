import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Component from './TrashPoint';
import {
  getTrashPointAction,
  getTrashPointImagesAction,
  clearTrashPointDetails,
  clearTrashPointImagesDetails, setDeleteActionComplete,
} from '../../store/actions/trashPoints';
import {
  getCreateTrashPointEntity,
  getProfileEntity,
  getTrashPointDetailsEntity,
  getTrashPointImagesEntity,
  isLoading,
} from '../../store/selectors';
import { guestLogIn } from '../../store/actions/auth';

const mapDispatch = {
  getTrashPointAction,
  clearTrashPointDetails,
  getTrashPointImagesAction,
  clearTrashPointImagesDetails,
  onGuestLogIn: guestLogIn,
  setDeleteActionComplete,
};
const selector = createStructuredSelector({
  trashPointImages: getTrashPointImagesEntity,
  isLoading,
  trashPointDetails: getTrashPointDetailsEntity,
  profile: getProfileEntity,
  updateTrashpoint: getCreateTrashPointEntity,
});

export default connect(selector, mapDispatch)(Component);
