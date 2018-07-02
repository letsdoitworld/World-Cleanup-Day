import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NetInfo, View, ActivityIndicator, Platform } from 'react-native';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import * as appSels from '../store/selectors/app';
import * as appActions from '../store/actions/app';
import { AlertModal } from '../components/AlertModal';
import { Badges } from '../assets/images';
import OfflineService from './Offline';
import strings from '../assets/strings';

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
  setConnectionChecked: appActions.setConnectionChecked,
  updateNetworkStatus: appActions.updateNetworkStatus,
  updateSyncStatus: appActions.updateSyncStatus,
  updateLackConnMessStatus: appActions.updateLackConnMessStatus,
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

      // this.closeAlertModalButton = {
      //   text: "BUTTON TEXT",
      //   onPress: this.handleCloseAlertModal,
      // };
    }
    componentWillMount() {
      this.checkConnection();

      this.connectionCheckInterval = setInterval(async () => {
        const isConnected = await NetInfo.isConnected.fetch();

        if (isConnected !== this.props.isConnected) {
          this.handleConnectionStatusChanged(isConnected);
        }

        if (isConnected && !this.props.inSync) {
          await OfflineService.syncToServer();
          this.handleSyncStatusChanged(true);
        }

        if (this.props.isNoLackConnectionAlert && isConnected) {
          this.props.updateLackConnMessStatus(!1);
        }

      }, 1000 * CONNECTION_CHECK_INTERVAL);
    }
    componentWillUnmount() {
      NetInfo.isConnected.removeEventListener(
        'connectionChange',
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
      this.props.navigator.switchToTab({
        tabIndex: 0
      });
    }
    checkConnection = async () => {
      let isConnected = await NetInfo.isConnected.fetch();

      // first ios call always says the internet is stopped
      isConnected = Platform.select({
        android: isConnected,
        ios: true,
      });

      NetInfo.isConnected.addEventListener(
        'connectionChange',
        data => this.handleConnectionStatusChanged(data)
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
            title={strings.label_network_off_warning_title}
            subtitle={strings.label_network_off_warning}
            image={Badges.NoConnection}
            onPress={this.handleCloseAlertModal}
            onOverlayPress={this.handleCloseAlertModal}
          />
          <WrappedComponent {...this.props} />
        </View>
      );
    }
  };
  return compose(
    connect(mapState, mapDispatch),
  )(networkGuard);
};