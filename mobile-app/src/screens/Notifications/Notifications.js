import React, {Component} from 'react';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import strings from '../../assets/strings';

import {EmptyStateScreen} from '../../components/EmptyStateScreen/EmptyStateScreen';
import styles from './styles';

export default class Notifications extends Component {
    render() {
        if (isUndefinedOtNullOrEmpty(this.props.notifications)) {
            return <EmptyStateScreen description={strings.label_text_notific_empty_text}/>
        } else {
            return null
        }
    }
}

function isUndefinedOtNullOrEmpty(array) {
    return array === undefined || array === null || array.length === 0
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
