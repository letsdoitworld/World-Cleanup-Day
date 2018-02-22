import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NetInfo, View, ActivityIndicator, Platform } from 'react-native';
import strings  from '../../assets/strings';

import { compose } from 'recompose';
import { connect } from 'react-redux';

import { operations as appOps, selectors as appSels } from '../reducers/app';
import { AlertModal } from '../components/AlertModal';

const CONNECTION_CHECK_INTERVAL = 10; // seconds

const mapState = (state) => {
  return {
    isConnected: appSels.isConnected(state),
    connectionChecked: appSels.wasConnectionChecked(state),
  };
};
const mapDispatch = {
  setConnectionChecked: appOps.setConnectionChecked,
  updateNetworkStatus: appOps.updateNetworkStatus,
};

export const withNetworkGuard = () => (WrappedComponent) => {
  const networkGuard = class extends Component {

    static propTypes = {
      updateNetworkStatus: PropTypes.func.isRequired,
      setConnectionChecked: PropTypes.func.isRequired,
      isConnected: PropTypes.bool.isRequired,
      connectionChecked: PropTypes.bool.isRequired,
    }
    constructor(props) {
      super(props);

      // create a new instance of the function
      // so it can be discarded safely from netinfo when the component unmounts
      this.handleConnectionStatusChanged =
        this.handleConnectionStatusChanged.bind(this);
    }
    componentWillMount() {
      this.checkConnection();

      this.connectionCheckInterval = setInterval(async () => {
        const isConnected = await NetInfo.isConnected.fetch();

        if (isConnected !== this.props.isConnected) {
          this.handleConnectionStatusChanged(isConnected);
        }
      }, 1000 * CONNECTION_CHECK_INTERVAL);
    }
    componentWillUnmount() {
      NetInfo.isConnected.removeEventListener(
        'change',
        this.handleConnectionStatusChanged,
      );
      if (this.connectionCheckInterval) {
        clearInterval(this.connectionCheckInterval);
      }
    }
    handleConnectionStatusChanged(isConnected) {
      this.props.updateNetworkStatus(isConnected);
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
      this.props.updateNetworkStatus(isConnected);
      this.props.setConnectionChecked();
    };
    render() {
      const { connectionChecked, isConnected } = this.props;
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
  return compose(
    translate(),
    connect(mapState, mapDispatch),
  )(networkGuard);
};
