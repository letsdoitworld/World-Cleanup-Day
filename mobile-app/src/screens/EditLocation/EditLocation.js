import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Image, Text } from 'react-native';
import { NavigationActions } from 'react-navigation';

import { Map } from '../../components/Map';
import { Button } from '../../components/Buttons';
import { DEFAULT_ZOOM, MARKER_STATUSES, SCREEN_WIDTH } from '../../shared/constants';
import { actions, selectors } from '../../reducers/trashpile';
import styles from './styles';

class EditLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      containerWidth: 0,
      containerHeight: 0,
      trashpileCoordinates: props.markers[0].latlng,
    };
  }

  componentWillMount() {
    this.props.setLocation(this.state.trashpileCoordinates, { fetchAddress: true });
  }

  handleOnLayout = ({ nativeEvent: { layout: { width, height } } }) => {
    this.setState({
      containerWidth: width,
      containerHeight: height,
    });
  };

  handleOnRegionChangeComplete = ({ latitude, longitude }) => {
    this.setState({ trashpileCoordinates: { latitude, longitude } }, () =>
      this.props.setAddress({ latitude, longitude }),
    );
  };

  handleSave = () => {
    this.props.setLocation(this.state.trashpileCoordinates);
    // TODO update trashpoint with new coordinates
    // { params: this.state.trashpileCoordinates }
    this.props.navigation.goBack();
  };

  render() {
    const { markers, initialRegion, trashpileAddress } = this.props;
    const { containerWidth, containerHeight } = this.state;

    const imagePosition = {
      top: containerHeight / 2 - 38,
      left: (containerWidth - 28) / 2,
    };

    return (
      <View style={{ flex: 1, position: 'relative' }} onLayout={this.handleOnLayout}>
        <Map
          markers={markers}
          initialRegion={initialRegion}
          onRegionChangeComplete={this.handleOnRegionChangeComplete}
        />
        <Image
          source={require('../../components/Map/images/change_location_pin.png')}
          resizeMode="contain"
          style={[styles.image, imagePosition]}
        />
        <View style={styles.adressContainer}>
          <Text style={styles.addressLabel}>{trashpileAddress}</Text>
        </View>
        <Button
          text="save"
          customStyles={{
            touchableContainer: { borderRadius: 0, width: SCREEN_WIDTH },
          }}
          onPress={this.handleSave}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(EditLocation);
