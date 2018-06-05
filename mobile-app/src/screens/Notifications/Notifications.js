import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text } from 'react-native';
import strings from '../../assets/strings';

import { EmptyStateScreen } from '../../components/EmptyStateScreen/EmptyStateScreen';
import Profile from '../Profile/Profile';

function isUndefinedOtNullOrEmpty(array) {
  return array === undefined || array === null || array.length === 0;
}

class Notifications extends Component {
    static navigatorStyle = {
      navBarTextColor: '#000000',
      navBarTextFontSize: 18,
      orientation: 'portrait',
      navBarTitleTextCentered: true,
      //  navBarTextFontFamily: 'font-name',
    };

    componentDidMount() {
      setTimeout(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.getLocation(position);
          },
          error => console.log('Error', error),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
        );
      }, 1000);
    }

    getLocation = (position) => {
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
            <EmptyStateScreen description={strings.label_text_notific_empty_text} />
            <TouchableOpacity onPress={this.props.logout}>
              <Text>Logout!</Text>
            </TouchableOpacity>
          </View>);
      }
      return null;
    }
}

Profile.propTypes = {
  country: PropTypes.string,
  onFetchLocation: PropTypes.func,
};

// export default compose(
//   connect(null, { logout }),
// )(Notifications);
export default Notifications;
