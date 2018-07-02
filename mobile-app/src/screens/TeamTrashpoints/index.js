import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import Component from './TeamTrashpoints';

const selector = createStructuredSelector({});

const actions = {};

export default connect(selector, actions)(Component);