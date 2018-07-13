import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Component from './ErrorModal';
import { setErrorMessage } from '../../store/actions/error';

const selector = createStructuredSelector({

});

const actions = {
  onSetError: setErrorMessage,
};

export default connect(selector, actions)(Component);
