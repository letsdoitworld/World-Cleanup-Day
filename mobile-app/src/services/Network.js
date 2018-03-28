import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NetInfo, View, ActivityIndicator, Platform } from 'react-native';
import { translate } from 'react-i18next';

import { compose } from 'recompose';
import { connect } from 'react-redux';

import { operations as appOps, selectors as appSels } from '../reducers/app';
import { AlertModal } from '../components/AlertModal';
import OfflineService from './Offline';
import { resetTo, rootNav } from '../services/Navigation';

const CONNECTION_CHECK_INTERVAL = 10; // seconds

const mapState = (state) => {
  return {
    isConnected: appSels.isConnected(state),
    connectionChecked: appSels.wasConnectionChecked(state),
    inSync: appSels.inSync(state),
    isNoLackConnectionAlert: appSels.isNoLackConnectionAlert(state),
  };
};
const mapDispatch = {
  setConnectionChecked: appOps.setConnectionChecked,
  updateNetworkStatus: appOps.updateNetworkStatus,
  updateSyncStatus: appOps.updateSyncStatus,
  updateLackConnMessStatus: appOps.updateLackConnMessStatus,
};

export const withNetworkGuard = () => (WrappedComponent) => {
  const networkGuard = class extends Component {

    static propTypes = {
      updateNetworkStatus: PropTypes.func.isRequired,
      setConnectionChecked: PropTypes.func.isRequired,
      updateSyncStatus: PropTypes.func.isRequired,
      updateLackConnMessStatus: PropTypes.func.isRequired,
      isConnected: PropTypes.bool.isRequired,
      connectionChecked: PropTypes.bool.isRequired,
      inSync: PropTypes.bool.isRequired,
      isNoLackConnectionAlert: PropTypes.bool.isRequired,
    }

    constructor(props) {
      super(props);

      // create a new instance of the function
      // so it can be discarded safely from netinfo when the component unmounts
      this.handleConnectionStatusChanged =
        this.handleConnectionStatusChanged.bind(this);

      this.handleCloseAlertModal =
        this.handleCloseAlertModal.bind(this);

      this.closeAlertModalButton = {
        text: props.t('label_button_acknowledge'),
        onPress: this.handleCloseAlertModal,
      };
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

        if (this.props.isNoLackConnectionAlert && isConnected) {
          this.props.updateLackConnMessStatus(!1);
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
    handleCloseAlertModal() {
      this.props.updateLackConnMessStatus(!0);
      resetTo(rootNav, 'Tabs');
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
      const { connectionChecked, isConnected, isNoLackConnectionAlert } = this.props;
      const showUserWarning = connectionChecked && !isConnected && !isNoLackConnectionAlert;

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
            buttons={[this.closeAlertModalButton]}
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
