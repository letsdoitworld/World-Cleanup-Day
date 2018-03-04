import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, Text, Modal } from 'react-native';

import { compose } from 'recompose';
import strings  from '../../assets/strings';

import { AlertModal } from '../../components/AlertModal';
import { Map } from '../../components/Map/Map';
import { Button } from '../../components/Buttons/Button';
import {
  DEFAULT_ZOOM,
  USER_ROLES,
  EDIT_LOCATION_BOUND,
} from '../../shared/constants';
import { getDistanceBetweenPointsInMeters } from '../../shared/helpers';
import { operations as locationOperations } from '../../reducers/location';
import { selectors as userSelectors } from '../../reducers/user';
import styles from './styles';

const MARKER_STATUS_IMAGES = {
  regular: require('../../components/Map/images/pointer_regular.png'),
  threat: require('../../components/Map/images/pointer_threat.png'),
  cleaned: require('../../components/Map/images/pointer_cleaned.png'),
};

class EditLocation extends Component {
  constructor(props) {
    super(props);

    const {
      navigation: { state: { params: { initialLocation, address, status } } },
    } = this.props;

    this.state = {
      containerWidth: 0,
      containerHeight: 0,
      trashpileCoordinates: {
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
      },
      showOutOfBondsModal: false,
      disableButton: false,
      loaded: false,
      initialLocation,
      changingLocation: { ...initialLocation },
      address,
      initialRegion: {
        latitude: initialLocation.latitude,
        longitude: initialLocation.longitude,
        latitudeDelta: DEFAULT_ZOOM,
        longitudeDelta: DEFAULT_ZOOM,
      },
      status,
    };
  }

  toggleModal = () => {
    this.setState(
      {
        showOutOfBondsModal: !this.state.showOutOfBondsModal,
      },
      () => {
        if (!this.state.showOutOfBondsModal) {
          this.map.animateToRegion(this.state.initialRegion);
        }
      },
    );
  };

  handleOnLayout = ({ nativeEvent: { layout: { width, height } } }) => {
    this.setState({
      containerWidth: width,
      containerHeight: height,
    });
  };

  handleOnRegionChangeComplete = ({ latitude, longitude }) => {
    const { initialRegion } = this.state;
    const { isLeader, isSuperAdmin } = this.props;
    const distance = getDistanceBetweenPointsInMeters(
      latitude,
      longitude,
      initialRegion.latitude,
      initialRegion.longitude,
    );

    const updatedState = {
      trashpileCoordinates: { latitude, longitude },
    };
    if (this.state.loaded) {
      updatedState.showOutOfBondsModal =
        !isLeader && !isSuperAdmin && distance > EDIT_LOCATION_BOUND;
    } else {
      updatedState.loaded = true;
    }

    this.setState(updatedState, () => {
      if (distance < EDIT_LOCATION_BOUND || isLeader || isSuperAdmin) {
        locationOperations
          .fetchAddress(updatedState.trashpileCoordinates)
          .then(address => {
            this.setState({ address, disableButton: false });
          });
      }
    });
  };

  handleOnRegionChange = () => {
    const { isLeader, isSuperAdmin } = this.props;
    if (isLeader || isSuperAdmin) {
      return;
    }

    if (!this.state.disableButton) {
      this.setState({ disableButton: true });
    }
  };

  handleSave = () => {
    this.props.navigation.state.params.onGoBack(
      this.state.trashpileCoordinates,
    );
    this.props.navigation.goBack();
  };

  getCircleProps = ({ latitude, longitude }) => {
    const { isLeader, isSuperAdmin } = this.props;
    if (isLeader || isSuperAdmin) {
      return;
    }

    return {
      center: {
        latitude,
        longitude,
      },
      borderColor: '#43619c',
      fillColor: 'rgba(62,142,222,0.3)',
      radius: EDIT_LOCATION_BOUND,
      borderWidth: 1,
    };
  };

  render() {
    const {
      containerWidth,
      containerHeight,
      showOutOfBondsModal,
      disableButton,
      status,
      changingLocation,
      address = { completeAddress: '' },
      initialRegion,
    } = this.state;

    const { t, role } = this.props;

    const imagePosition = {
      top: containerHeight / 2 - 49,
      left: (containerWidth - 36) / 2,
    };

    return (
      <View style={styles.container} onLayout={this.handleOnLayout}>
        <Map
          initialRegion={initialRegion}
          onRegionChangeComplete={this.handleOnRegionChangeComplete}
          circleProps={this.getCircleProps(initialRegion)}
          getRef={map => (this.map = map)}
          onRegionChange={this.handleOnRegionChange}
        />
        <Image
          source={MARKER_STATUS_IMAGES[status]}
          resizeMode="contain"
          style={[styles.image, imagePosition]}
        />
        <View style={styles.adressContainer}>
          <Text style={styles.addressLabel}>{address.completeAddress}</Text>
        </View>
        <Button
          text={t('label_button_edit_loc_set')}
          onPress={this.handleSave}
          style={styles.saveButtonStyle}
          disabled={disableButton}
        />

        <AlertModal
          visible={showOutOfBondsModal}
          title={t('label_error_generic_error_subtitle')}
          subtitle={t('label_error_change_loc_text')}
          buttons={[
            { text: t('label_button_acknowledge'), onPress: this.toggleModal },
          ]}
          onOverlayPress={this.toggleModal}
        />

      </View>
    );
  }
}

const mapStateToProps = state => ({
  isLeader: userSelectors.isLeader(state),
  isSuperAdmin: userSelectors.isSuperAdmin(state),
});

const mapDispatchToProps = {};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withNavigationHelpers(),
  translate(),
)(EditLocation);
