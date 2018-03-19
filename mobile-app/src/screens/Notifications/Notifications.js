import React, {Component} from 'react';
import { View, TouchableOpacity, Text, PermissionsAndroid } from 'react-native';
import {compose} from 'recompose';
import {connect} from 'react-redux';
import strings from '../../assets/strings';

import {EmptyStateScreen} from '../../components/EmptyStateScreen/EmptyStateScreen';
import styles from './styles';

import { logout } from '../../store/actions/auth';
import Profile from "../Profile/Profile";
import PropTypes from 'prop-types';

class Notifications extends Component {

    static navigatorStyle = {
        navBarTextColor: '#000000',
        navBarTextFontSize: 18,
        orientation: 'portrait',
        navBarTitleTextCentered: true,
        //  navBarTextFontFamily: 'font-name',
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setTimeout(() => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.getLocation(position);
                },
                error => console.log('Error', error),
                { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
            );
        }, 1000)
    }

    getLocation = position => {
        const { onFetchLocation } = this.props;
        onFetchLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
        });
    };

    render() {
        if (isUndefinedOtNullOrEmpty(this.props.notifications)) {
            return (
                <View>
                    <EmptyStateScreen description={strings.label_text_notific_empty_text}/>
                    <TouchableOpacity onPress={this.props.logout}>
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

Profile.propTypes = {
    country: PropTypes.string,
    onFetchLocation: PropTypes.func,
};

export default compose(
  connect(null, { logout }),
)(Notifications);
// export default Notifications;
