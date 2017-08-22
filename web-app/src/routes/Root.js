import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { selectors as userSelectors } from '../reducers/user';

import Landing from '../pages/Landing';
import { Home } from './Home';

const Root = ({ isAuthenticated, isAllowedRole, ...props }) => {
  if (!isAuthenticated || (isAuthenticated && !isAllowedRole)) {
    return <Landing {...props} />;
  }
  return <Home {...props} />;
};
Root.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isAllowedRole: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: !!userSelectors.getUserToken(state),
  isAllowedRole: userSelectors.isAllowedRole(state),
});
export default connect(mapStateToProps)(Root);
