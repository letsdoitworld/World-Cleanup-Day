import React, {Component} from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import strings from '../../assets/strings';

import {EmptyStateScreen} from '../../components/EmptyStateScreen/EmptyStateScreen';
import styles from './styles';

import { logout } from '../../api';

export default class Notifications extends Component {

    static navigatorStyle = {
        navBarTextColor: '#000000',
        navBarTextFontSize: 18,
        orientation: 'portrait',
        navBarTitleTextCentered: true,
        //  navBarTextFontFamily: 'font-name',
    };

    render() {
        if (isUndefinedOtNullOrEmpty(this.props.notifications)) {
            return (
                <View>
                    <EmptyStateScreen description={strings.label_text_notific_empty_text}/>
                    <TouchableOpacity onPress={() => logout()}>
                        <Text>Logout!</Text>
                    </TouchableOpacity>
                </View>)
        } else {
            return null
        }
    }
}

function isUndefinedOtNullOrEmpty(array) {
    return array === undefined || array === null || array.length === 0
}

// export default connect(null, {  })(Notifications)

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
