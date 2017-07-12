import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, Text, Modal } from 'react-native';

import { compose } from 'recompose';

import { withNavigationHelpers } from '../../services/Navigation';
import { AlertModal } from '../../components/AlertModal';
import { Map } from '../../components/Map';
import { Button } from '../../components/Buttons';
import {
  DEFAULT_ZOOM,
  MARKER_STATUSES,
  EDIT_LOCATION_BOUND,
} from '../../shared/constants';
import { getDistanceBetweenPointsInMeters } from '../../shared/helpers';
import { actions, selectors } from '../../reducers/trashpile';
import styles from './styles';

const MARKER_STATUS_IMAGES = {
  regular: require('../../components/Map/images/pointer_regular.png'),
  threat: require('../../components/Map/images/pointer_threat.png'),
};

class EditLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      containerWidth: 0,
      containerHeight: 0,
      trashpileCoordinates: props.markers[0].latlng,
      showOutOfBondsModal: false,
      initialLocation: {
        latitude: props.initialRegion.latitude,
        longitude: props.initialRegion.longitude,
      },
      disableButton: false,
      loaded: false,
    };
  }

  toggleModal = () => {
    this.setState(
      {
        showOutOfBondsModal: !this.state.showOutOfBondsModal,
      },
      () => {
        if (!this.state.showOutOfBondsModal) {
          this.map.animateToRegion(this.props.initialRegion);
        }
      },
    );
  };

  componentWillMount() {
    this.props.setLocation(this.state.trashpileCoordinates, {
      fetchAddress: true,
    });
  }

  handleOnLayout = ({ nativeEvent: { layout: { width, height } } }) => {
    this.setState({
      containerWidth: width,
      containerHeight: height,
    });
  };

  handleOnRegionChangeComplete = ({ latitude, longitude }) => {
    const { initialRegion } = this.props;
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
      updatedState.showOutOfBondsModal = distance > EDIT_LOCATION_BOUND;
    } else {
      updatedState.loaded = true;
    }

    this.setState(updatedState, () => {
      if (distance < EDIT_LOCATION_BOUND) {
        this.props.setAddress({ latitude, longitude });
        this.setState({ disableButton: false });
      }
    });
  };

  handleOnRegionChange = () => {
    if (!this.state.disableButton) {
      this.setState({ disableButton: true });
    }
  };

  handleSave = () => {
    this.props.setLocation(this.state.trashpileCoordinates);
    this.props.navigation.goBack();
  };

  getCircleProps = ({ latitude, longitude }) => {
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
      markers,
      initialRegion,
      trashpileAddress,
      navigation: { state: { params: { status = MARKER_STATUSES.REGULAR } } },
    } = this.props;
    const {
      containerWidth,
      containerHeight,
      showOutOfBondsModal,
      disableButton,
    } = this.state;

    const imagePosition = {
      top: containerHeight / 2 - 49,
      left: (containerWidth - 36) / 2,
    };

    return (
      <View style={styles.container} onLayout={this.handleOnLayout}>
        <Map
          markers={markers}
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
          <Text style={styles.addressLabel}>{trashpileAddress}</Text>
        </View>
        <Button
          text="Set trashpoint location"
          onPress={this.handleSave}
          style={styles.saveButtonStyle}
          disabled={disableButton}
        />
        <Modal visible={showOutOfBondsModal} transparent animationType="fade">
          <View style={styles.modalBackground}>
            <AlertModal
              headerText="Out of bounds"
              text="Please place a point within 100 meters of your location."
              buttons={[{ text: 'Ok, got it!', onPress: this.toggleModal }]}
            />
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = ({ trashpile }) => {
  const location = selectors.getLocation(trashpile);
  const { latitude, longitude } = location;

  const markers = [
    {
      latlng: {
        latitude,
        longitude,
      },
      title: '',
      description: '',
      status: MARKER_STATUSES.USER,
    },
  ];

  const initialRegion = {
    latitude,
    longitude,
    latitudeDelta: DEFAULT_ZOOM,
    longitudeDelta: DEFAULT_ZOOM,
  };

  return {
    markers,
    initialRegion,
    trashpileAddress: selectors.getPreviewAddress(trashpile),
  };
};

const mapDispatchToProps = {
  setLocation: actions.setFullLocation,
  setAddress: actions.fetchPreviewAddress,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withNavigationHelpers(),
)(EditLocation);
