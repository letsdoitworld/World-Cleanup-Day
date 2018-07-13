import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Component from './TrashPoint';
import {
  getTrashPointAction,
  getTrashPointImagesAction,
  clearTrashPointDetails,
  clearTrashPointImagesDetails,
} from '../../store/actions/trashPoints';
import {
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
};
const selector = createStructuredSelector({
  trashPointImages: getTrashPointImagesEntity,
  isLoading,
  trashPointDetails: getTrashPointDetailsEntity,
  profile: getProfileEntity,
});

export default connect(selector, mapDispatch)(Component);
