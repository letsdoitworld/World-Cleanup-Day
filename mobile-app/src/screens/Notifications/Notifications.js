import React, { Component } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import strings  from '../../assets/strings';

import { EmptyStateScreen } from '../../components/EmptyStateScreen';
import styles from './styles';

class Notifications extends Component {
  render() {
    return this.props.notifications.length === 0
      ? <EmptyStateScreen description={this.props.t('label_text_notific_empty_text')} />
      : null;
  }
}
//
// const mapStateToProps = () => ({
//   notifications: [],
// });
//
// const mapDispatchToProps = {};
//
// export default compose(
//   connect(mapStateToProps, mapDispatchToProps),
//   withNavigationHelpers(),
//   translate(),
// )(Notifications);
