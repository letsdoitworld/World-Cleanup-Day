import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NetInfo, View, ActivityIndicator, Platform } from 'react-native';
import { translate } from 'react-i18next';

import { compose } from 'recompose';
import { connect } from 'react-redux';

import { operations as appOps, selectors as appSels } from '../reducers/app';
import { AlertModal } from '../components/AlertModal';
import OfflineService from './Offline';

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
  updateSyncStatus: appOps.updateSyncStatus
};

export const withNetworkGuard = () => (WrappedComponent) => {
  const networkGuard = class extends Component {

    static propTypes = {
      updateNetworkStatus: PropTypes.func.isRequired,
      setConnectionChecked: PropTypes.func.isRequired,
      updateSyncStatus: PropTypes.func.isRequired,
      isConnected: PropTypes.bool.isRequired,
      connectionChecked: PropTypes.bool.isRequired,
      inSync: PropTypes.bool.isRequired,
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

        if (isConnected && !this.props.inSync) {
          this.handleSyncStatusChanged(true);
          await OfflineService.syncToServer();
          this.handleSyncStatusChanged(false);
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
    handleSyncStatusChanged(inSync) {
      this.props.updateSyncStatus(inSync);
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
          <WrappedComponent {...this.props} />
        </View>
      );
      // TODO add button in this alert and on this only once before close by this button
      /*
      *           <AlertModal
            visible={showUserWarning}
            title={this.props.t('label_network_off_warning_title')}
            subtitle={this.props.t('label_network_off_warning')}
          />

      * */
    }
  };
  return compose(
    translate(),
    connect(mapState, mapDispatch),
  )(networkGuard);
};
