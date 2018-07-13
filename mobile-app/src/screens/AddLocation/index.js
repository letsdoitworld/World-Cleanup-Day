import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { changeUserLocation } from '../../store/actions/locations';
import Component from './AddLocation';

const selector = createStructuredSelector({

});

const actions = {
  onChangeUserLocation: changeUserLocation,
};

export default connect(selector, actions)(Component);
