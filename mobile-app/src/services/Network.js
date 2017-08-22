import React, { Component } from 'react';
import { NetInfo, View, ActivityIndicator, Platform } from 'react-native';
import { translate } from 'react-i18next';
import { AlertModal } from '../components/AlertModal';

export const withNetworkGuard = () => (WrappedComponent) => {
  const networkGuard = class extends Component {
    constructor(props) {
      super(props);

      this.state = { isConnected: false, connectionChecked: false };

      // create a new instance of the function
      // so it can be discarded safely from netinfo when the component unmounts
      this.handleConnectionStatusChanged = this.handleConnectionStatusChanged.bind(
        this,
      );
    }
    componentWillMount() {
      this.checkConnection();
    }
    componentWillUnmount() {
      NetInfo.isConnected.removeEventListener(
        'change',
        this.handleConnectionStatusChanged,
      );
    }
    handleConnectionStatusChanged(isConnected) {
      this.setState({ isConnected });
    }
    checkConnection = async () => {
      let isConnected = await NetInfo.isConnected.fetch();

      // first ios call always says the internet is stopped
      isConnected = Platform.select({
        android: isConnected,
        ios: true,
      });
      
      
      NetInfo.isConnected.addEventListener(
        'change',
        this.handleConnectionStatusChanged,
      );

      this.setState({ isConnected, connectionChecked: true });
    };
    render() {
      const { connectionChecked, isConnected } = this.state;
      const showUserWarning = connectionChecked && !isConnected;

      if (!connectionChecked) {
        return (
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <ActivityIndicator />
          </View>
        );
      }
      return (
        <View style={{ flex: 1 }}>
          <AlertModal
            visible={showUserWarning}
            title={this.props.t('label_network_off_warning_title')}
            subtitle={this.props.t('label_network_off_warning')}
          />
          <WrappedComponent {...this.props} />
        </View>
      );
    }
  };
  return translate()(networkGuard);
};
