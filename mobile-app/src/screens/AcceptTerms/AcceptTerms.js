import React from 'react';
import { View, StatusBar, Text, TouchableOpacity } from 'react-native';
import { Navigation } from 'react-native-navigation';
import PropTypes from 'prop-types';

import { Icons } from '../../assets/images';
import strings from '../../assets/strings';

import { Terms } from '../../components/Terms';
import styles from './styles';


const cancelId = 'cancelId';

class AcceptTerms extends React.Component {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarTitleTextCentered: true,
  };

  static navigatorButtons = {
    leftButtons: [
      {
        icon: Icons.Back,
        id: cancelId,
      },
    ],
  };

  constructor(props) {
    super(props);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }
  onPressDecline = () => {
    this.props.onDecline();
  };
  onPressAccept = () => {
    this.props.onAccept();
  };

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case cancelId: {
          this.back();
          break;
        }
        default:
      }
    }
  }

  back = () => {
    Navigation.dismissModal();
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar translucent barStyle="dark-content" />
        <Terms style={styles.terms} />
        <View
          style={styles.acceptContainer}
        >
          <TouchableOpacity onPress={this.onPressAccept} style={styles.touchable}>
            <Text style={styles.buttonText}>{strings.label_accept}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={styles.denyContainer}
        >
          <TouchableOpacity onPress={this.onPressDecline} style={styles.touchable}>
            <Text style={styles.buttonText}>{strings.label_decline}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

AcceptTerms.propTypes = {
  navigator: PropTypes.object,
  onDecline: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
};

export default AcceptTerms;
