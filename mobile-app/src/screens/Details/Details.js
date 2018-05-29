import React, { Component } from 'react';
import { MessageBarManager } from 'react-native-message-bar';
import {
  Text,
  View,
  ScrollView,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import _ from 'lodash';

import { translate } from 'react-i18next';

import { Map } from '../../components/Map';
import {
  getHeightPercentage,
  getWidthPercentage,
  getDistanceBetweenPointsInMeters,
  handleSentryError
} from '../../shared/helpers';
import {
  SCREEN_WIDTH,
  DEFAULT_ZOOM,
  TRASH_COMPOSITION_TYPES_HASH,
  SCREENS,
} from '../../shared/constants';
import {
  operations as trashpileOperations,
  selectors as trashpileSelectors,
} from '../../reducers/trashpile';
import { selectors as appSelectors } from '../../reducers/app';
import styles from './styles';
import { PhotoPicker } from '../../components/PhotoPicker';
import { Divider } from '../../components/Divider';
import { AmountPicker, AMOUNT_STATUSES } from '../../components/AmountPicker';
import {
  operations as locationOperations,
  selectors as locSels,
} from '../../reducers/location';
import { selectors as userSelectors } from '../../reducers/user';
import { StatusText } from '../../components/StatusText';
import { TrashpointDate } from '../../components/TrashpointDate';
import { Button } from '../../components/Buttons';
import { AlertModal } from '../../components/AlertModal';
import { withCameraActions } from '../../services/Camera';
import ImageService from '../../services/Image';
import { withLoadingScreen } from '../../services/Loading';

import { AMOUNT_HASH } from '../../shared/constants';

const ALERT_CHECK_IMG = require('../CreateMarker/alert_check.png');

const SIZE_WIDTH135 = getWidthPercentage(135);

class Details extends Component {
  constructor(props) {
    super(props);

    this.state = {
      address: {},
      initialLocation: props.navigation.state.params.latlng,
      showFooter: false,
      isIn100M: false,
    };
    this.handleConfirm = _.debounce(this.handleConfirm, 2000, {
      leading: true,
      trailing: false,
    });
    this.handleEdit = _.debounce(this.handleEdit, 2000, {
      leading: true,
      trailing: false,
    });
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.activeScreen === SCREENS.DETAILS ||
      this.props.userLocation !== nextProps.userLocation
    );
  }

  componentWillMount() {
    if (_.has(this.props.navigation.state, 'params.markerId')) {
      this.props.fetchMarkerDetails(
        this.props.navigation.state.params.markerId,
      );
      // locationOperations
      //   .fetchAddress(this.state.initialLocation)
      //   .then((address) => {
      //     this.setState({
      //       address,
      //     });
      //   });
    }
  }

  async componentWillReceiveProps(nextProps) {
    const { marker: { composition, latlng, id } } = nextProps;
    if (composition.length > 0) {
      try {
        const { latitude, longitude } = nextProps.userLocation;

        const showFooter =
          getDistanceBetweenPointsInMeters(
            latitude,
            longitude,
            latlng.latitude,
            latlng.longitude,
          ) <= 100;
        this.setState({ showFooter });
      } catch (e) {
        handleSentryError(ex);
        console.log(e.message);
      }
    }
  }

  displayTrashCompositionTypes = () => {
    const { composition, hashtags } = this.props.marker;
    return [...composition, ...hashtags].map(trashCompositionType => {
      const text = this.props.t(TRASH_COMPOSITION_TYPES_HASH[trashCompositionType]);
      return (
        <View style={styles.containerTag} key={trashCompositionType}>
          <Text style={styles.tagText}>
            {text || trashCompositionType}
          </Text>
        </View>
      );
    });
  };
  canDisplayFooter = () => {
    const { showFooter } = this.state;
    const {
      isAuthenticated,
      locationActive,
      isSuperAdmin,
      isLeader,
    } = this.props;

    if (!isAuthenticated || !locationActive) {
      return false;
    }

    return isSuperAdmin || isLeader || showFooter;
  };
  displayFooter = () => {
    let footer = (
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerText}>
            {this.props.t('label_text_editTP_ask')}
          </Text>
        </View>
        <View style={styles.footerButtons}>
          <Button
            text={this.props.t('label_text_editTP_letsconfirm')}
            customStyles={{
              touchableContainer: {
                width: SIZE_WIDTH135,
                backgroundColor: '#B4EC51',
              },
              text: { color: '#2D5917' },
            }}
            onPress={this.handleConfirm}
          />
          <Button
            text={this.props.t('label_text_editTP_letsedit')}
            style={{ marginLeft: getWidthPercentage(10) }}
            customStyles={{
              touchableContainer: {
                width: SIZE_WIDTH135,
                backgroundColor: 'white',
              },
              text: { color: '#3E8EDE' },
            }}
            onPress={this.handleEdit}
          />
        </View>
      </View>
    );

    if (this.props.isOwnTrashpoint) {
      footer = (
        <View style={styles.bottomContainer}>
          <Button
            style={styles.createButton}
            text={this.props.t('label_edit_trashpoint_button')}
            onPress={this.handleEdit}
          />
        </View>
      );
    }

    return this.canDisplayFooter() ? footer : null;
  };

  handleConfirm = async () => {
    const {
      marker: { latlng, id },
      userLocation,
      setErrorMessage,
      t,
    } = this.props;
    try {
      const { latitude, longitude } = userLocation;

      const isIn100M =
        getDistanceBetweenPointsInMeters(
          latitude,
          longitude,
          latlng.latitude,
          latlng.longitude,
        ) <= 100;
      if (isIn100M) {
        const {
          cancelled,
          uri,
          base64,
          width,
          height,
        } = await this.props.takePhotoAsync({ quality: 0.2, base64: true });
        if (cancelled) {
          return;
        }
        const thumbnailBase64 = await ImageService.getResizedImageBase64({
          uri,
          width,
          height,
        });
        const uploadStatus = await trashpileOperations.handleUpload({
          photos: [{ uri, thumbnail: { base64: thumbnailBase64 }, base64 }],
          markerId: id,
        });
        if (!uploadStatus) {
          setErrorMessage(t('label_confirm_marker_missing_photos'));
        } else {
          this.props.navigation.goBack(null);
          setTimeout(() =>
            this.showSuccessAlert(t('label_alert_editTP_confirm')),
          );
        }
      } else {
        this.setState({
          isIn100M,
        });
      }
    } catch (e) {
      handleSentryError(e);
      console.log(e.message);
    }
  };
  showSuccessAlert = message => {
    MessageBarManager.showAlert({
      title: message,
      alertType: 'success',
      avatar: ALERT_CHECK_IMG,
      duration: 4000,
      viewTopInset: Platform.select({
        android: StatusBar.currentHeight,
        ios: 15,
      }),
      stylesheetSuccess: {
        strokeColor: 'transparent',
        backgroundColor: '#3e8ede',
        width: getWidthPercentage(320),
        height: getHeightPercentage(50),
      },
      titleStyle: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'noto-sans-bold',
      },
    });
  };

  handleEdit = () => {
    this.props.navigation.navigate('EditTrashpoint');
  };

  renderStreetName = () => {
    const { marker } = this.props;

    if (marker && marker.name) {
      return marker.name;
    }

    const { initialLocation: { longitude, latitude } } = this.state;
    return `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
  };
  renderStreetDetails = () => {
    const { address } = this.state;
    const { marker } = this.props;

    if (marker && marker.address) {
      return marker.address;
    }

    return '';
  };
  renderMarkerCoords = () => {
    const { initialLocation: { longitude, latitude } } = this.state;
    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  };
  renderFullAddressContainer = () => {
    // {`${this.renderStreetDetails()} | ${latitude.toFixed(
    //             6,
    //           )}, ${longitude.toFixed(6)}`}
    const streetDetails = this.renderStreetDetails().trim();
    const gpsCoords = this.renderMarkerCoords();
    if (streetDetails && gpsCoords) {
      return `${streetDetails} | ${gpsCoords}`;
    }
    if (streetDetails) {
      return streetDetails;
    }
    if (gpsCoords) {
      return gpsCoords;
    }
  };

  render() {
    const { marker } = this.props;
    const {
      isIn100M,
      address,
      initialLocation: { longitude, latitude },
    } = this.state;
    const latitudeDelta = DEFAULT_ZOOM;
    const mapHeight = getHeightPercentage(160);
    const longitudeDelta = latitudeDelta * SCREEN_WIDTH / mapHeight;
    const thumbnails = _.has(marker, 'thumbnails')
      ? marker.thumbnails.map(({ url }) => url)
      : [];

    return (
      <ScrollView style={styles.container}>
        <AlertModal
          visible={isIn100M}
          title={this.props.t('label_error_editTP_out_of_rng_subtitle')}
          subtitle={this.props.t('label_100m_limit_modal')}
          onOverlayPress={_.noop}
        />
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
            {this.renderStreetName()}
          </Text>
          <View style={styles.completeAddressContainer}>
            <Image
              source={require('../../assets/images/icon_location.png')}
              style={styles.locationImage}
            />
            <Text style={styles.addressContainer}>
              {this.renderFullAddressContainer()}
            </Text>
          </View>
          <Divider customStyles={{ backgroundColor: '#D9D9D9' }} />
          <StatusText status={marker.status} />
          <TrashpointDate
            createdDate={marker.createdAt}
            updatedDate={marker.updatedAt || marker.createdAt}
            createdBy={marker.createdByName}
            updatedBy={marker.updatedByName || marker.createdByName}
          />
          {/* <View*/}
          {/* style={{*/}
          {/* flexDirection: 'row',*/}
          {/* justifyContent: 'flex-start',*/}
          {/* marginTop: getHeightPercentage(2),*/}
          {/* paddingLeft: getWidthPercentage(20),*/}
          {/* }}*/}
          {/* >*/}
          {/* <SimpleButton text="View full history" />*/}
          {/* </View>*/}
        </View>
        <View>
          <PhotoPicker maxPhotos={3} photos={thumbnails} title={this.props.t('label_text_detailsTP_photos')} />
        </View>
        <Divider />
        <View style={{ padding: getWidthPercentage(20) }}>
          <Text style={{ fontFamily: 'noto-sans-bold', fontSize: 16 }}>
            {this.props.t('label_text_detailsTP_amount')}
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
              {this.props.t(AMOUNT_HASH[marker.amount]).toUpperCase()}
            </Text>
          </View>
        </View>
        <Divider />
        <View style={styles.containerTypes}>
          <Text style={styles.typesTitle}>
            {this.props.t('label_text_detailsTP_type')}
          </Text>
          <View style={styles.containerTags}>
            {this.displayTrashCompositionTypes()}
          </View>
        </View>
        {this.displayFooter()}
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
  isAuthenticated: PropTypes.bool.isRequired,
  locationActive: PropTypes.bool.isRequired,
  userLocation: PropTypes.any.isRequired,
  takePhotoAsync: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    marker: trashpileSelectors.markerDetailsSelector(state),
    isAuthenticated: userSelectors.isAuthenticated(state),
    locationActive: locSels.hasLocationActive(state),
    userLocation: locSels.userLocationSelector(state),
    isOwnTrashpoint: userSelectors.isOwnTrashpoint(state),
    loading: trashpileSelectors.isLoading(state),
    activeScreen: appSelectors.getActiveScreen(state),
    isSuperAdmin: userSelectors.isSuperAdmin(state),
    isLeader: userSelectors.isLeader(state),
  };
};

const mapDispatchToProps = {
  fetchMarkerDetails: trashpileOperations.fetchMarkerDetails,
  setErrorMessage: appSelectors.setErrorMessage,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withCameraActions(),
  translate(),
)(Details);
