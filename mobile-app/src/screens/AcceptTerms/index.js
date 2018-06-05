import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { logout, requestTerms } from '../../store/actions/auth';
import { getTerms } from '../../store/selectors';
import Component from './AcceptTerms';


const selector = createStructuredSelector({
  accepted: getTerms,
});

const action = {
  onDecline: logout,
  onAccept: requestTerms,
};

export default connect(selector, action)(Component);

