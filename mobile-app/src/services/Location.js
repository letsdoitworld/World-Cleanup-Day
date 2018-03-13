import React, { Component } from 'react';

import { View, ActivityIndicator, Platform } from 'react-native';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import axios from 'axios';
import strings  from '../assets/strings';

import { AlertModal } from '../components/AlertModal';

import { GOOGLE_GEOCODE_API_URL, API_KEY } from '../shared/constants';

 import {operations as locationOps} from '../reducers/location/operations';

// selectors as locationSels,

const checkLocationPermission = async () => {
  const answer = await Permissions.askAsync(Permissions.LOCATION);
  return answer.status === 'granted';
};
const checkLocationActive = async () => {
  const {
    locationServicesEnabled: locationActive,
  } = await Location.getProviderStatusAsync();
  return locationActive;
};
const getLocation = async () => {
  const { coords } = await Location.getCurrentPositionAsync({});
  return coords;
};
const watchLocation = (callback) => {
  return Location.watchPositionAsync(
    {
      enableHighAccuracy: true,
      timeInterval: 1000,
      distanceInterval: 10,
    },
    ({ coords }) => {
      callback(coords);
    },
  );
};

const composeLocationGuard = () => (WrappedComponent) => {
  const locationGuard = class extends Component {
    static propTypes = {
      hasLocationActive: PropTypes.bool.isRequired,
      hasPermissionActive: PropTypes.bool.isRequired,
      updateUserLocation: PropTypes.func.isRequired,
      setLocationActive: PropTypes.func.isRequired,
      setLocationPermission: PropTypes.func.isRequired,
      showModal: PropTypes.bool.isRequired,
      setErrorModalVisible: PropTypes.func.isRequired,
    };

    constructor(props) {
      super(props);

      this.state = { locationConfigured: false, permissionChecked: false };
    }

    componentWillMount() {
      this.configureLocation();
    }
    componentWillUnmount() {
      if (
        this.locationWatcher &&
        typeof this.locationWatcher.remove === 'function'
      ) {
        this.locationWatcher.remove();
      }
      if (this.locationActiveWatcher) {
        clearTimeout(this.locationActiveWatcher);
      }
    }

    componentWillReceiveProps(nextProps) {
      const { hasLocationActive } = nextProps;
      if (this.props.hasLocationActive !== hasLocationActive) {
        this.handleLocationStatusChanged(hasLocationActive);
      }
    }

    startLocationWatcher = async () => {
      const { updateUserLocation } = this.props;
      const initialLocation = await getLocation();
      updateUserLocation(initialLocation);
      this.locationWatcher = watchLocation((location) => {
        updateUserLocation(location);
      });
      return undefined;
    };
    stopLocationWatcher = async () => {
      if (this.locationWatcher && this.locationWatcher.remove) {
        this.locationWatcher.remove();
      }
      return Promise.resolve(undefined);
    };

    handleLocationStatusChanged = async (locationActive) => {
      if (locationActive) {
        return this.startLocationWatcher();
      }
      return this.stopLocationWatcher();
    };

    updateLocationActive(locationActive) {
      if (this.props.hasLocationActive !== locationActive) {
        this.props.setLocationActive(locationActive);
      }
    }

    checkLocationProviderStatus = async () => {
      const locationActive = await checkLocationActive();
      this.updateLocationActive(locationActive);
      this.locationActiveWatcher = setTimeout(
        this.checkLocationProviderStatus,
        5000,
      );
    };

    configureLocation = async () => {
      const { setLocationPermission } = this.props;

      const locationPermitted = await checkLocationPermission();
      setLocationPermission(locationPermitted);
      this.setState({ permissionChecked: true });
      if (locationPermitted) {
        const locationActive = await checkLocationActive();
        this.updateLocationActive(locationActive);

        await this.handleLocationStatusChanged(locationActive);

        this.locationActiveWatcher = setTimeout(
          this.checkLocationProviderStatus,
          5000,
        );
      }

      this.setState({ locationConfigured: true });
    };

    closeModal = () => {
      this.props.setErrorModalVisible(false);
    };

    render() {
      const PERMISSION_MESSAGE_TXT = Platform.select({
        android: this.props.t('label_location_permission_warning_android'),
        ios: this.props.t('label_location_permission_warning_ios'),
      });
      const LOCATION_MESSAGE_TXT = this.props.t('label_location_off_warning');
      const { hasLocationActive, hasPermissionActive, showModal } = this.props;
      const { locationConfigured, permissionChecked } = this.state;
      const locationWarning = locationConfigured && !hasLocationActive;
      const permissionWarning = !hasPermissionActive && permissionChecked;
      const showUserWarning =
        showModal && (permissionWarning || locationWarning);
      const warningMessage = permissionWarning
        ? PERMISSION_MESSAGE_TXT
        : LOCATION_MESSAGE_TXT;

      if (!locationConfigured) {
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
            onOverlayPress={this.closeModal}
            onPress={this.closeModal}
            visible={showUserWarning}
            title={this.props.t('label_location_modal_title')}
            subtitle={warningMessage}
          />
          <WrappedComponent {...this.props} />
        </View>
      );
    }
  };
  return translate()(locationGuard);
};

const mapState = state => ({
  hasLocationActive: locationSels.hasLocationActive(state),
  hasPermissionActive: locationSels.hasLocationPermission(state),
  showModal: locationSels.shouldShowModal(state),
});
// const mapDispatch = {
//   ...locationOps,
// };
export const withLocationGuard = () =>
  compose(connect(mapState, mapDispatch), composeLocationGuard());

export const fetchAddress = async ({ latitude, longitude }) => {
  const { data } = await axios.get(
    `${GOOGLE_GEOCODE_API_URL}?key=${API_KEY}&latlng=${latitude},${longitude}`,
  );
  let completeAddress = '';
  let streetAddress = '';
  let locality = '';
  let country = '';
  let countryAlpha2Code = '';
  let streetNumber = '';
  let subLocality = '';

  if (data && data.results && data.results.length > 0) {
    completeAddress = data.results[0].formatted_address;
    data.results[0].address_components.forEach(({ types, long_name, short_name }) => {
      if (types.indexOf('route') !== -1) {
        streetAddress = long_name;
      } else if (types.indexOf('street_number') !== -1) {
        streetNumber = long_name;
      } else if (types.indexOf('locality') !== -1) {
        locality = long_name;
      } else if (types.indexOf('country') !== -1) {
        country = long_name;
        countryAlpha2Code = short_name;
      } else if (types.indexOf('sublocality') !== -1) {
        subLocality = long_name;
      }
      if (types.indexOf('street_address') !== -1 && !streetAddress) {
        streetAddress = long_name;
      }
    });
  }
  if (!streetAddress && subLocality && locality) {
    streetAddress = `${subLocality}, ${locality}`;
  }
  if (!streetAddress) {
    streetAddress = completeAddress;
  }
  return {
    completeAddress,
    streetAddress,
    locality,
    country,
    streetNumber,
    subLocality,
    countryAlpha2Code,
  };
};
