import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { fetchUserLocation } from '../../store/actions/locations';

import {
  getUserCountry,
} from '../../store/selectors';

import Component from './Notifications';

const selector = createStructuredSelector({
  country: getUserCountry,
});

const actions = {
  onFetchLocation: fetchUserLocation,
};

export default connect(selector, actions)(Component);
