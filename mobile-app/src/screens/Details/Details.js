import React, { Component } from 'react';
import { Text, View, ScrollView, Image } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Map } from '../../components/Map';
import { SimpleButton } from '../../components/Buttons';
import { getHeightPercentage, getWidthPercentage } from '../../shared/helpers';
import { SCREEN_WIDTH } from '../../shared/constants';
import { fetchTrashpileAddress as fetchTrashpileAddressAction } from '../../reducers/trashpile';
import styles from './styles';
import { PhotoPicker } from '../../components/PhotoPicker';
import { Divider } from '../../components/Divider';
import { AmountPicker, AMOUNT_STATUSES } from '../../components/AmountPicker';

class Details extends Component {
  constructor() {
    super();
  }

  componentWillMount() {
    const {
      marker: { latlng: { latitude, longitude } },
    } = this.props.navigation.state.params;
    this.props.fetchTrashpileAddress({ latitude, longitude });
  }

  render() {
    const { marker } = this.props.navigation.state.params;
    const {
      address: {
        streetAddress = '',
        locality = '',
        country = '',
        streetNumber = '',
        subLocality = '',
      },
    } = this.props;
    const isThreat = marker.status === 'threat';
    const latitude = marker.latlng.latitude;
    const longitude = marker.latlng.longitude;
    const latitudeDelta = 0.0922;
    const mapHeight = getHeightPercentage(160);
    const longitudeDelta = latitudeDelta * SCREEN_WIDTH / mapHeight;

    return (
      <ScrollView style={styles.container}>
        <View style={{ height: mapHeight, width: SCREEN_WIDTH }}>
          <Map
            markers={[marker]}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            initialRegion={{
              latitudeDelta,
              longitudeDelta,
              latitude,
              longitude,
            }}
            liteMode
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.streetContainer}>
            {`${streetAddress} ${streetNumber}`}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: getHeightPercentage(5),
            }}
          >
            <Image
              source={require('../../assets/images/icon_menu_map.png')}
              style={styles.locationImage}
            />
            <Text style={styles.addressContainer}>
              {`${subLocality}, ${locality}, ${country} | ${latitude.toFixed(
                6,
              )}, ${longitude.toFixed(6)}`}
            </Text>
          </View>
          <Divider />
          {isThreat &&
            <View style={styles.imageContainer}>
              <Image
                source={require('./images/icon_status_small_threat.png')}
                style={styles.threatImage}
              />
              <Text style={styles.threatText}>
                This point is a threat!
              </Text>
            </View>}
          <View style={styles.imageContainer}>
            <Image
              source={require('./images/icon_creation.png')}
              style={styles.creationImage}
            />
            <Text style={styles.createdText}>
              Created
            </Text>
            <Text style={styles.dateCreatedText}>
              13.02.2017 by Shirley Gonzales
            </Text>
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={require('./images/icon_updated.png')}
              style={styles.updateImage}
            />
            <Text style={styles.updatedText}>
              Updatedd
            </Text>
            <Text style={styles.dateUpdatedText}>
              03.04.2017 by Uzeyir Ismayilzada
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginTop: getHeightPercentage(2),
            }}
          >
            <SimpleButton text="View full history" />
          </View>
        </View>
        <View>
          <PhotoPicker maxPhotos={3} photos={marker.photos} />
        </View>
        <Divider />
        <View style={{ padding: getWidthPercentage(20) }}>
          <Text style={{ fontFamily: 'noto-sans-bold', fontSize: 16 }}>
            Trash amount
          </Text>
          <AmountPicker amount={AMOUNT_STATUSES[marker.amount]} disabled />
          <View
            style={{
              paddingTop: getHeightPercentage(20),
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: '#7F7F7F',
                fontFamily: 'noto-sans-bold',
                fontSize: 13,
              }}
            >
              {marker.amount.toUpperCase()}
            </Text>
          </View>
        </View>
        <Divider />
        <View style={styles.containerTypes}>
          <Text style={styles.typesTitle}>
            Trash type
          </Text>
          <View style={styles.containerTags}>
            {marker.types.map(type =>
              <View style={styles.containerTag}>
                <Text style={styles.tagText}>{type}</Text>
              </View>,
            )}
          </View>
        </View>
      </ScrollView>
    );
  }
}

Details.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        marker: PropTypes.any,
      }),
    }),
  }),
};

const mapStateToProps = ({ trashpile: { address } }) => {
  return {
    address,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchTrashpileAddress(coords) {
      dispatch(fetchTrashpileAddressAction(coords));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Details);
