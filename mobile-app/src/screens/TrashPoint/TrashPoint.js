import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import Permissions from 'react-native-permissions';
import Swiper from 'react-native-page-swiper';
import PageControl from 'react-native-page-control';
import PropTypes from 'prop-types';

import strings from '../../assets/strings';
import { Map as MapView } from '../../components';
import {
  CLIENT_ERRORS,
  DEFAULT_ZOOM,
  MAX_DISTANCE_METERS_TRASHPOINT,
} from '../../shared/constants';
import TrashAmountLevel from '../../components/TrashAmountLevel/TrashAmountLevel';
import Chips from '../../components/Chips/Chips';
import { TRASH_POINT_MENU_SCREEN, UPDATE_TRASH_POINT } from '../index';
import Tags from '../../components/Tags/Tags';
import styles from './styles';
import { cancelId, menuId, navigatorButtons, navigatorStyle } from './config';
import { LocationIcon } from '../../assets/images';
import {
  getCurrentPositionAndroid,
  getCurrentPositionIos,
  getDistance,
} from '../../shared/geo';
import LocationAlertModal from '../../components/AlertModal/LocationAlertModal';

const moment = require('moment');

export const STATUS_IMAGES = {
  cleaned: require('../../assets/images/icCleanedTrashpoint.png'),
  outdated: require('../../assets/images/icRegularTrashpointInactive.png'),
  regular: require('../../assets/images/icRegularTrashpoint.png'),
  threat: require('../../assets/images/icToxicTrashpoint.png'),
};

export const STATUS_LABEL = {
  cleaned: strings.label_cleaned_trashpoint,
  outdated: strings.label_outdated_trashpoint,
  regular: strings.label_regular_trashpoint,
  threat: strings.label_urgent_trashpoint,
};

export const STATUS_COLOR = {
  cleaned: '#13bd73',
  outdated: '#999999',
  regular: '#ffa81c',
  threat: '#e01280',
};

export default class TrashPoint extends Component {
  static navigatorStyle = navigatorStyle;

  static navigatorButtons = navigatorButtons;

  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      trashPoint: props.trashPoint,
      userLocation: null,
      photos: [],
      isUpdateTrashPointVisible: false,
      showUserWarning: false,
    };

    this.cancelButton = {
      text: strings.label_button_cancel,
      onPress: this.cancelPrivateDialog.bind(this),
    };

    this.registerButton = {
      text: strings.label_register,
      onPress: this.handleLogInPress.bind(this),
    };

    UIManager.setLayoutAnimationEnabledExperimental
    && UIManager.setLayoutAnimationEnabledExperimental(true);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentWillMount() {
    this.hanleUpdateTrashPointLocation();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.trashPointImages) {
      this.setState({ photos: nextProps.trashPointImages });
    }
    if (nextProps.trashPointDetails) {
      const hoursFromCreation = this.localizedTime
        .diff(moment(nextProps.trashPointDetails.createdAt), 'hours');
      const isTrashPointNew = hoursFromCreation < 24;
      this.setState({
        trashPoint: nextProps.trashPointDetails,
        isUpdateTrashPointVisible: isTrashPointNew,
      });
    }
    if (!nextProps.trashPointDetails && this.props.trashPointDetails
      && !this.props.cancelTrashPointFromEvent) {
      this.props.navigator.dismissAllModals();
    }
  }

  componentWillUnmount() {
    this.props.clearTrashPointDetails();
    this.props.clearTrashPointImagesDetails();
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'willAppear': {
        this.updateOpened = false;
        this.props.getTrashPointAction({
          trashpointId: this.props.trashPoint.id,
          userId: this.props.profile && this.props.profile.id,
        });
        this.props.getTrashPointImagesAction(this.state.trashPoint.id);
        break;
      }
      case cancelId: {
        if (this.props.cancelTrashPointFromEvent) {
          this.props.navigator.pop();
          break;
        }
        // We need this for close modal when app open from social network link
        this.props.navigator.dismissAllModals();
        break;
      }
      case menuId: {
        const photo = (this.state.photos && this.state.photos.length > 0)
          ? this.state.photos[0].url
          : 'https://image.ibb.co/i8vW6T/img_Event_Cover_Big1.png';
        this.props.navigator.showModal({
          screen: TRASH_POINT_MENU_SCREEN,
          title: strings.label_menu,
          navigatorStyle: {
            navBarHidden: true,
            screenBackgroundColor: 'transparent',
            modalPresentationStyle: 'overCurrentContext',
          },
          passProps: {
            trashPoint: this.state.trashPoint,
            photo,
          },
        });
        break;
      }
      case 'didDisappear':
        if (!this.updateOpened) {
          this.props.clearTrashPointDetails();
        }
        break;

      default:
    }
  }

  onSelectionConfirmed() {
    console.log('onSelectionConfirmed work');
    this.props.onCheckedChanged(!this.props.isChecked);
    this.props.navigator.pop();
  }

  getMarker() {
    const { trashPoint } = this.state;
    return [{
      id: trashPoint.id,
      latlng: trashPoint.location,
      status: trashPoint.status,
      item: trashPoint,
      isSelected: true,
    }];
  }

  getInitialRegion() {
    const { trashPoint } = this.props;
    return {
      latitude: trashPoint.location.latitude,
      longitude: trashPoint.location.longitude,
      latitudeDelta: DEFAULT_ZOOM,
      longitudeDelta: DEFAULT_ZOOM,
    };
  }

  hanleUpdateTrashPointLocation() {
    this.checkPermissionsAndHandleLocation().then(async (res) => {
      if (res === 'authorized') {
        let myLocation;
        if (Platform.OS === 'android') {
          myLocation = await getCurrentPositionAndroid();
        } else {
          const { coords: { latitude, longitude } } = await getCurrentPositionIos();
          myLocation = { latitude, longitude };
        }
        this.setState({ userLocation: myLocation });
      }
    });
  }

  checkPermissionsAndHandleLocation = async () => {
    let permission = await Permissions.check('location').then((response) => {
      return response;
    });
    if (permission === 'undetermined') {
      permission = await Permissions.request('location').then((response) => {
        return response;
      });
    }
    switch (permission) {
      case 'authorized': {
        return 'authorized';
      }
      case 'denied': {
        return 'denied';
        /* alert(strings.label_allow_access_to_location); */
      }
      default:
    }
  };

  timezoneOffset = new Date().getTimezoneOffset();
  localizedTime = moment().utcOffset(Math.abs(this.timezoneOffset));

  handleLogInPress = () => {
    if (Platform.OS === 'android') {
      this.cancelPrivateDialog();
    }
    setTimeout(() => {
      const { onGuestLogIn } = this.props;
      onGuestLogIn();
    }, 1000);
  };

  cancelPrivateDialog = () => {
    this.props.navigator.dismissModal();
    this.props.navigator.dismissLightBox();
  };

  showWarningDialog = (message, buttons) => {
    this.props.navigator.showLightBox({
      screen: 'ERROR_MODAL',
      passProps: {
        error: message,
        buttons,
      },
      style: {
        backgroundBlur: 'dark',
        tapBackgroundToDismiss: true,
      },
    });
  };

  handleUpdatePress() {
    if (this.state.userLocation !== null) {
      if (!this.props.profile) {
        const buttons = [this.cancelButton, this.registerButton];
        this.showWarningDialog(CLIENT_ERRORS.registerTPError, buttons);
      } else {
        this.updateOpened = true;
        const trashPointClone = { ...this.state.trashPoint };
        trashPointClone.photos = this.state.photos;
        const shouldShowUpdate = getDistance(this.state.userLocation,
          this.props.trashPoint.location) <= MAX_DISTANCE_METERS_TRASHPOINT;

        this.props.navigator.push({
          screen: UPDATE_TRASH_POINT,
          title: strings.label_update_trashpoint,
          passProps: {
            trashPoint: trashPointClone,
            shouldShowUpdate,
            onBackFromUpdate: (trashPoint) => {
              this.setState({ trashPoint });
            },
          },
        });
      }
    } else {
      this.setState({ showUserWarning: true });
    }
  }

  isProgressEnabled = () => {
    return this.props.isLoading;
  };

  spinner() {
    return (
      <ActivityIndicator
        style={[styles.spinner]}
        size="large"
        color="rgb(0, 143, 223)"
      />
    );
  }

  closeModal = () => {
    this.setState({ showUserWarning: false });
  };

  renderProgress = () => {
    if (this.isProgressEnabled()) {
      return this.spinner();
    }
    return null;
  }

  renderPages() {
    let key = 0;
    const photos = this.state.photos;

    return photos
      ? photos.map((photo) => {
        return this.renderPage(photo.url, key++);
      })
      : null;
  }

  renderPage(uri, key) {
    return (
      <TouchableOpacity
        key={key}
      >
        <Image
          resizeMethod={'resize'}
          resizeMode={'stretch'}
          style={styles.photo}
          source={{ uri }}
        />
      </TouchableOpacity>
    );
  }

  renderUpdateButton() {
    if (!this.state.userLocation || this.props.updateDisabled
      || !this.state.trashPoint.creator) {
      return null;
    }
    const isMyTrashPoint = this.props.profile &&
      this.state.trashPoint.creator.id === this.props.profile.id;

    const shouldShowUpdate = getDistance(this.state.userLocation,
      this.props.trashPoint.location) <= MAX_DISTANCE_METERS_TRASHPOINT;

    const shouldShowUdateTrashppointBtn =
      (isMyTrashPoint && this.state.isUpdateTrashPointVisible) ||
      (shouldShowUpdate);

    return shouldShowUdateTrashppointBtn ?
      <View style={styles.createTrashPointButtonContainer}>
        <TouchableOpacity
          onPress={this.handleUpdatePress.bind(this)}
          style={styles.confirmButton}
        >
          <Text style={styles.confirmButtonText}>
            {strings.label_update_trashpoint}
          </Text>
        </TouchableOpacity>
      </View> : null;
  }

  render() {
    if (!this.state.trashPoint) return this.spinner();
    const {
      address,
      status,
      creator,
      updater,
      createdAt,
      updatedAt,
      amount,
      composition,
      isIncluded,
      hashtags,
      origin,
    } = this.state.trashPoint;
    const tags = (hashtags) ? hashtags.map((hashtag) => {
      return {
        label: hashtag,
        selected: false,
      };
    }) : [];
    const photos = this.state.photos;
    return (
      <View
        style={styles.container}
        pointerEvents={this.isProgressEnabled() ? 'none' : 'auto'}
      >
        <ScrollView>
          <LocationAlertModal
            onOverlayPress={this.closeModal}
            onPress={this.closeModal}
            visible={this.state.showUserWarning}
            title={strings.label_location_modal_title}
            subtitle={strings.label_error_location_text}
          />
          <MapView
            markers={this.getMarker()}
            initialRegion={this.getInitialRegion()}
            region={this.getInitialRegion()}
            style={styles.map}
            getRef={(map) => {
              this.map = map;
            }}
          />
          <View style={styles.row}>
            <Image source={LocationIcon} />
            <Text style={styles.textLabel}>
              {address}
            </Text>
          </View>{this.renderUpdateButton()}
          {
            !isIncluded && this.props.onCheckedChanged
              ? <TouchableOpacity
                style={this.props.isChecked
                  ? [styles.confirmButton, { backgroundColor: 'rgb(225, 18, 131)' }]
                  : styles.confirmButton}
                onPress={() => this.onSelectionConfirmed()}
              >
                <Text style={styles.confirmButtonText}>
                  {
                    this.props.isChecked
                      ? strings.label_remove_trashPoint
                      : strings.label_add_trashPoint
                  }
                </Text>
              </TouchableOpacity>
              : null
          }
          <View style={styles.rowHeader}>
            <Text style={styles.textHeader}>
              {strings.label_type_of_trashpoint}
            </Text>
          </View>
          <View style={styles.row}>
            <Image
              resizeMethod={'scale'}
              resizeMode={'center'}
              source={STATUS_IMAGES[status]}
              style={styles.statusImage}
            />
            <Text style={[styles.textLabel, { color: STATUS_COLOR[status] }]}>
              {STATUS_LABEL[status]}
            </Text>
          </View>
          <View style={styles.rowHeader}>
            <Text style={styles.textHeader}>
              {strings.label_about_creator}
            </Text>
          </View>
          <View style={styles.row}>
            <Image
              resizeMethod={'scale'}
              resizeMode={'center'}
              style={[styles.avatar,
                { opacity: creator && creator.pictureURL !== '' ? 1 : 0 }]}
              source={{ uri: creator ? creator.pictureURL : undefined }}
            />
            <Text style={styles.textLabel}>
              {creator ? creator.name : undefined}
            </Text>
          </View>
          <View style={[styles.row, { marginTop: 1 }]}>
            <Image source={require('./images/icTime.png')} />
            <Text style={styles.textLabel}>
              {moment(createdAt).format('DD.MM.YYYY')}
            </Text>
          </View>
          <View style={styles.rowHeader}>
            <Text style={styles.textHeader}>
              {strings.label_TP_updates}
            </Text>
          </View>
          <View style={styles.row}>
            <Image
              resizeMethod={'scale'}
              resizeMode={'center'}
              style={[styles.avatar,
                { opacity: updater && updater.pictureURL !== '' ? 1 : 0 }]}
              source={{ uri: updater ? updater.pictureURL : undefined }}
            />
            <Text style={styles.textLabel}>
              {updater ? updater.name : strings.label_no_updates}
            </Text>
          </View>
          <View style={[styles.row, { marginTop: 1 }]}>
            <Image source={require('./images/icTime.png')} />
            <Text style={styles.textLabel}>
              {updatedAt ? moment(updatedAt).format('DD.MM.YYYY')
                : strings.label_time_to_contribute}
            </Text>
          </View>
          <View style={styles.rowHeader}>
            <Text style={styles.textHeader}>
              {strings.label_trash_amount}
            </Text>
          </View>
          <TrashAmountLevel
            level={amount}
            paddingHorizontal={20}
          />
          {hashtags && hashtags.length > 0 &&
          <View style={styles.rowHeader}>
            <Text style={styles.textHeader}>
              {strings.label_additional_tags}
            </Text>
          </View>
          }
          {tags && tags.length > 0 && <Tags tags={tags} />}
          <View style={styles.rowHeader}>
            <Text style={styles.textHeader}>
              {strings.label_trash_type}
            </Text>
          </View>
          {composition && <Chips types={composition} />}
          {origin && <View style={styles.rowHeader}>
            <Text style={styles.textHeader}>
              {strings.label_trash_origin}
            </Text>
          </View>}
          {origin && <Chips types={origin} />}
          <View style={styles.rowHeader}>
            <Text style={styles.textHeader}>
              {strings.label_photos}
            </Text>
          </View>
          {
            photos &&
            <Swiper
              pager={false}
              onPageChange={(index) => {
                this.setState((previousState) => {
                  return {
                    ...previousState,
                    index,
                  };
                });
              }}
              style={styles.swiper}
            >
              {this.renderPages()}
            </Swiper>
          }
          <PageControl
            style={styles.pageControlStyle}
            numberOfPages={photos ? photos.length : 0}
            currentPage={this.state.index}
            hidesForSinglePage
            pageIndicatorTintColor="rgb(40, 38, 51)"
            currentPageIndicatorTintColor={'rgb(63, 162, 247)'}
            indicatorStyle={styles.dotStyle}
            currentIndicatorStyle={styles.activeDotStyle}
          />
        </ScrollView>
        {this.renderProgress()}
      </View>
    );
  }
}

TrashPoint.propTypes = {
  trashPoint: PropTypes.object,
  profile: PropTypes.object,
  navigator: PropTypes.object,
  isChecked: PropTypes.bool,
  onCheckedChanged: PropTypes.func,
  trashPointDetails: PropTypes.object,
  cancelTrashPointFromEvent: PropTypes.bool,
  updateDisabled: PropTypes.bool,
  clearTrashPointDetails: PropTypes.func,
  clearTrashPointImagesDetails: PropTypes.func,
  onGuestLogIn: PropTypes.func,
};
