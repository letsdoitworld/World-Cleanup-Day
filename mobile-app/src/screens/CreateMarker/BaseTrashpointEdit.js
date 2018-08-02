import React from 'react';
import _ from 'lodash';
import ImagePicker from 'react-native-image-crop-picker';
import {
  ActivityIndicator,
  BackHandler, Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import strings from '../../assets/strings';
import ImageService from '../../services/Image';
import LocationPicker from './components/LocationPicker/LocationPicker';
import StatusPicker from './components/StatusPicker/StatusPicker';
import { PhotoPicker } from '../../components/PhotoPicker';
import { Tags } from '../../components/Tags';
import { AMOUNT_STATUSES } from '../../components/AmountPicker';
import { AlertModal } from '../../components/AlertModal';
import { CustomSlider } from '../../components/CustomSlider';
import { DEFAULT_ZOOM, MARKER_STATUSES } from '../../shared/constants';
import { Badges } from '../../assets/images';

import styles from './styles';
import { geocodeCoordinates,
    getCurrentPosition} from '../../shared/geo';

import { ADD_LOCATION, CREATE_MARKER } from '../index';
import { getWidthPercentage } from '../../shared/helpers';

const HANDFUL_IMAGE_DATA = {
  default: require('../../components/AmountPicker/images/icon_handful_blue_outline.png'),
  active: require('../../components/AmountPicker/images/icon_handful_blue_fill.png'),
};
const BAGFUL_IMAGE_DATA = {
  default: require('../../components/AmountPicker/images/icon_bagful_blue_outline.png'),
  active: require('../../components/AmountPicker/images/icon_bagful_blue_fill.png'),
};
const CARTLOAD_IMAGE_DATA = {
  default: require('../../components/AmountPicker/images/icon_cartload_blue_outline.png'),
  active: require('../../components/AmountPicker/images/icon_cartload_blue_fill.png'),
};
const TRUCKLOAD_IMAGE_DATA = {
  default: require('../../components/AmountPicker/images/icon_truck_blue_outline.png'),
  active: require('../../components/AmountPicker/images/icon_truck_blue_fill.png'),
};

const MAX_HASHTAGS_NO = 15;

const cancelId = 'cancelId';

class BaseTrashpointEdit extends React.Component {
  static navigatorStyle = {
    tabBarHidden: true,
    navBarTitleTextCentered: true,
    navBarBackgroundColor: 'white',
    navBarTextColor: '$textColor',
    navBarTextFontSize: 17,
    navBarTextFontFamily: 'Lato-Bold',
    statusBarColor: 'white',
    statusBarTextColorScheme: 'dark',
  };

  static navigatorButtons = {
    leftButtons: [
      {
        icon: require('../../../src/assets/images/icons/ic_back.png'),
        id: cancelId,
      },
    ],

  };

  constructor(props) {
    super(props);

    const { photos, coords, trashPoint } = props;

    console.log('COnstructor ', coords);

    const hashtags = trashPoint &&
      trashPoint.hashtags
      && trashPoint.hashtags.map((hashtag) => {
        return {
          label: hashtag,
          selected: false,
        };
      });

    this.actualCoords = coords;

    const trashPointCompositions = props.createTrashPoint.trashpointCompositions;
    const trashCompositionTypes = trashPointCompositions ? trashPointCompositions.map(
      trashCompositionType => ({
        ...trashCompositionType,
        selected: trashPoint && trashPoint.composition && trashPoint.composition
          .find(type => trashCompositionType.type === type),
      }),
    ) : [];

    const state = {
      initialPhotos: trashPoint && [...trashPoint.photos],
      photos: photos ? [...photos] : [],
      temporaryHashtag: null,
      amount: trashPoint ? AMOUNT_STATUSES[trashPoint.amount] : AMOUNT_STATUSES.handful,
      status: trashPoint ? trashPoint.status : MARKER_STATUSES.REGULAR,
      congratsShown: !!trashPoint,
      trashCompositionTypes,
      trashOrigins: props.trashPoint && props.trashPoint.trashpointOrigins,
      hashtags: trashPoint ? hashtags : [],
      initialLocation: trashPoint ? trashPoint.location : coords,
      editableLocation: trashPoint ? trashPoint.location : coords,
      address: trashPoint ? trashPoint.address : '',
      disableCreateTrashpointButton: false,
      locationSetByUser: false,
      isCreateButtonPressed: false,
      isUpdateDialogShown: false,
      isSuccessDialogShown: false,
      deletedIds: [],
      showModal: false,
      isEditLocationPress: false,
    };

    this.state = state;

    this.redirectSettingsButton = {
      text: strings.label_button_acknowledge,
      onPress: this.hideValidation,
    };

    this.successCancelButton = {
      text: strings.label_text_lets_do_it,
      onPress: this.successCancel.bind(this),
    };
    this.successUpdateButton = {
      text: strings.label_text_lets_do_it,
      onPress: this.onUpdateSuccessPress.bind(this),
    };
    this.registerButton = {
      text: strings.label_add,
      onPress: this.successAddAnotherTrashPoint.bind(this),
    };

    this.congratsTimeout = setTimeout(() => {
      if (!this.state.congratsShown) {
        this.setState({ congratsShown: true });
      }
      this.congratsTimeout = undefined;
    }, 4000);
    this.handleCompleteAction = _.debounce(
      this.handleCompleteAction,
      2000,
      {
        leading: true,
        trailing: false,
      },
    );

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  async componentDidMount() {
    if (Platform.OS === 'ios') {
      this.watchID = navigator.geolocation.watchPosition((position)=>{
        if (position) {
          const { coords: { latitude, longitude } } = position;
          this.actualCoords = {
            latitude,
            longitude,
            latitudeDelta: DEFAULT_ZOOM,
            longitudeDelta: DEFAULT_ZOOM,
            longitudeDelta: DEFAULT_ZOOM,
          };
        }
        },
        {enableHighAccuracy: true, timeout: 1000, maximumAge: 0,distanceFilter:1});
    }
  }

  async componentWillMount() {
    this.props.getTrashPointOriginAction();
    await this.fetchAddressAsync();

    BackHandler.addEventListener('hardwareBackPress', this.openModal);
  }

  componentWillReceiveProps(nextProps) {
    const { isConnected: wasConnected, createTrashPoint, trashPoint } = this.props;
    const { isConnected } = nextProps;
    const { address, locationSetByUser } = this.state;
    if (this.props.createTrashPoint.trashpointDeleted) {
      this.props.navigator.popToRoot();
      return;
    }
    if (!wasConnected && isConnected && !locationSetByUser &&
      (!address || !address.completeAddress)) {
      this.fetchAddressAsync().catch();
    }
    if (this.props.createTrashPoint.error) {
      this.setState((previousState) => {
        return {
          ...previousState,
          isCreateButtonPressed: false,
        };
      });
    }

    if (this.props.trashPoint && this.props.createTrashPoint.success) {
      this.setState({ isUpdateDialogShown: true });
      this.props.dismissSuccessUpdate();
    }

    if (createTrashPoint.trashpointCompositions && !this.props.createTrashPoint.error
      && !this.state.isEditLocationPress) {
      let listTrashCompositions = createTrashPoint.trashpointCompositions;
      if (trashPoint && trashPoint.composition.length > 0) {
        listTrashCompositions = listTrashCompositions.map(item => ({
          label: item.label,
          type: item.type,
          selected: trashPoint.composition.indexOf(item.type) >= 0,
        }));
      }
      this.setState({ trashCompositionTypes: listTrashCompositions });
    }
    if (createTrashPoint.trashpointOrigins && !this.props.createTrashPoint.error
      && !this.state.isEditLocationPress) {
      let listTrashOrigin = createTrashPoint.trashpointOrigins;
      if (trashPoint && trashPoint.origin && trashPoint.origin.length > 0) {
        listTrashOrigin = listTrashOrigin.map(item => ({
          label: item.label,
          type: item.type,
          selected: trashPoint.origin.indexOf(item.type) >= 0,
        }));
      }
      this.setState({ trashOrigins: listTrashOrigin });
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
    navigator.geolocation.stopObserving();
    BackHandler.removeEventListener('hardwareBackPress', this.openModal);
  }


  onNavigatorEvent = (event) => {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case cancelId: {
          this.openModal();
          break;
        }
        default:
      }
    }
  };

  onLocationSelected = (location) => {
    this.setState((previousState) => {
      return {
        ...previousState,
        editableLocation: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        address: location.place,
        isEditLocationPress: false,
      };
    });
  };

  onUpdateSuccessPress = () => {
    this.setState({
      isUpdateDialogShown: false,
      temporaryHashtag: null,
    });
    this.props.navigator.pop();
  };

  openModal = () => {
    this.setState({ showModal: true });
  };

  closeModal = () => {
    this.setState({ showModal: false });

  };

  leave = () => {
    this.setState({ showModal: false });
    this.props.navigator.pop();
  };

  cancelButton = {
    text: strings.label_button_cancel,
    onPress: this.closeModal,
  };

  leaveButton = {
    text: strings.label_button_leave,
    onPress: this.leave,
  };

  toRad(Value) {
    return Value * Math.PI / 180;
  }

  calcCrow(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const radlat1 = this.toRad(lat1);
    const radlat2 = this.toRad(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) *
      Math.cos(radlat1) * Math.cos(radlat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }

  fetchAddressAsync = async (coords) => {
    const place = await geocodeCoordinates(coords || this.state.initialLocation);
    this.setState((previousState) => {
      return {
        ...previousState,
        address: place.mainText,
      };
    });
  };

  successAddAnotherTrashPoint = async () => {
    const image = await ImagePicker.openCamera({
      compressImageQuality: 0.2,
      cropping: true,
      includeBase64: true,
    });
    const { width, height, data, path } = image;
    const uri = path;
    const base64 = data;

    const thumbnailBase64 = await ImageService.getResizedImageBase64({
      uri,
      width,
      height,
    });
    var newPosition;
    if (Platform.OS === 'ios') {
      newPosition = this.actualCoords
    } else {
      newPosition = await getCurrentPosition();
    }
    console.log('successAddAnotherTrashPoint ', newPosition)
    this.props.dismissSuccessUpdate();
    this.props.navigator.pop({ animated: false });

    this.props.navigator.push({
      screen: CREATE_MARKER,
      title: strings.label_button_createTP_confirm_create,
      passProps: {
        photos: [{ uri, thumbnail: { base64: thumbnailBase64 }, base64 }],
        coords: newPosition,
      },
    });
  };

  successCancel = () => {
    this.props.dismissSuccessUpdate();
    setTimeout(() => {
      this.props.navigator.pop();
    }, 500);
  };

  showValidation = (text) => {
    this.setState({
      validation: true,
      validationText: text,
    });
  };
  hideValidation = () => {
    this.setState({
      validation: false,
    });
  };

  handleEditLocationPress = () => {
    const { initialLocation } = this.state;
    this.setState({
      isEditLocationPress: true,
    });
    this.props.navigator.push({
      screen: ADD_LOCATION,
      title: strings.label_header_edit_loc,
      passProps: {
        restrictDistance: true,
        initialLocation,
        searchDisabled: !this.props.trashPoint,
        onLocationSelected: this.onLocationSelected.bind(this),
      },
    });
  };

  handlePhotoAdd = async () => {
    const image = await ImagePicker.openCamera({
      width: 500,
      height: 350,
      cropping: true,
      includeBase64: true,
    });
    const { width, height, data, path } = image;
    const uri = path;

    const thumbnailBase64 = await ImageService.getResizedImageBase64({
      uri,
      width,
      height,
    });

    this.setState((previousState) => {
      return {
        ...previousState,
        photos: [...previousState.photos,
          {
            uri,
            base64: data,
            thumbnail: { base64: thumbnailBase64 },
          }],
      };
    });
  };

  // eslint-disable-next-line no-unused-vars
  handlePhotoDelete(photo, index) {
  }

  handleTrashCompositionTypeSelect = index => () => {
    const selectedTag = this.state.trashCompositionTypes[index];
    this.setState({
      trashCompositionTypes: [
        ...this.state.trashCompositionTypes.slice(0, index),
        { ...selectedTag, selected: !selectedTag.selected },
        ...this.state.trashCompositionTypes.slice(index + 1),
      ],
    });
  };

  handleTrashCompositionOriginSelect = index => () => {
    const selectedTag = this.state.trashOrigins[index];
    this.setState({
      trashOrigins: [
        ...this.state.trashOrigins.slice(0, index),
        { ...selectedTag, selected: !selectedTag.selected },
        ...this.state.trashOrigins.slice(index + 1),
      ],
    });
  };

  handleHashtagDelete = index => () => {
    this.setState({
      hashtags: [
        ...this.state.hashtags.slice(0, index),
        ...this.state.hashtags.slice(index + 1),
      ],
    });
  };

  validate() {
    const { photos, trashCompositionTypes, initialPhotos } = this.state;
    const isNewPhotosEmpty = !photos || photos.length === 0;
    const isExistingPhotosEmpty = !initialPhotos || initialPhotos.length === 0;
    if ((isNewPhotosEmpty && isExistingPhotosEmpty)
      || trashCompositionTypes && !trashCompositionTypes.find(type => type.selected)
    ) {
      this.showValidation(strings.label_error_saveTP_pic_and_type);
      return false;
    }
    return true;
  }


  handleStatusChanged = (status) => {
    this.setState({
      status,
    });
  };

  handleAddHahstag = () => {
    const temporaryHashtag = get(this.state, 'temporaryHashtag', '');
    const hashtags = this.state.hashtags || [];

    if (hashtags.length === MAX_HASHTAGS_NO) {
      return;
    }

    let labels = temporaryHashtag.replace(/[^0-9a-z,]/gi, '').split(',');

    if (labels.length === 1 && labels[0] === '') {
      return;
    }

    labels = labels.map(label => `#${label}`);

    labels = _.difference(labels, hashtags.map(hashtag => hashtag.label));

    if (labels.length === 0) {
      return this.setState({
        temporaryHashtag: null,
      });
    }

    this.setState({
      hashtags: [...hashtags, ...labels.map(label => ({ label }))],
      temporaryHashtag: null,
    });

    console.log("handleAddHahstag ", hashtags);
  };

  handleChangeHashtagText = (text) => {
    this.setState({ temporaryHashtag: text });
  };

  handleAmountSelect = (amount) => {
    this.setState({
      amount,
    });
  };

  markCongratsShown = () => {
    this.setState((previousState) => {
      return {
        ...previousState,
        congratsShown: true,
      };
    });
    if (this.congratsTimeout) {
      clearTimeout(this.congratsTimeout);
      this.congratsTimeout = undefined;
    }
  };


  isProgressEnabled() {
    return this.props.isLoading;
  }

  spinner() {
    return (
      <ActivityIndicator
        style={styles.spinner}
        size="large"
        color="rgb(0, 143, 223)"
      />
    );
  }

  handleCompleteAction() {
  }

  renderSectionHeader(text) {
    return (
      <Text style={styles.headerSection}>
        {text}
      </Text>
    );
  }

  renderBottomComponents() {
    return null;
  }

  render() {
    const {
      initialPhotos,
      photos,
      trashCompositionTypes,
      status,
      hashtags,
      temporaryHashtag,
      amount = AMOUNT_STATUSES.handful,
      validation = false,
      congratsShown,
      editableLocation,
      address = '',
      trashOrigins,
    } = this.state;

    if (!congratsShown) {
      return (
        <AlertModal
          visible
          title={strings.label_text_congrats_image}
          subtitle={strings.label_text_congrats_subtitle}
          text={strings.label_text_congrats_text}
          image={Badges.congrats}
          buttons={[]}
          onOverlayPress={this.markCongratsShown}
        />
      );
    }
    const uris = photos ? photos.map(({ uri }) => {
      return { url: uri };
    }) : [];
    const shownPhotos = this.props.trashPoint ?
      initialPhotos.concat(uris) :
      uris;

    return (
      <View>
        <ScrollView
          pointerEvents={this.isProgressEnabled() ? 'none' : 'auto'}
          style={styles.scrollView}
        >
          <AlertModal
            image={Badges.trashPointAdded}
            visible={this.state.isUpdateDialogShown}
            title={strings.label_title_trashpoint_updated}
            subtitle={strings.label_thank_you_for_contr}
            text={strings.label_every_small_step}
            buttons={[this.successUpdateButton]}
          />
          <AlertModal
            visible={validation}
            title={strings.label_leave_title}
            subtitle={strings.label_its_an_error}
            text={strings.label_error_saveTP_pic_and_type}
            image={Badges.trashPointValidation}
            buttons={[]}
            onOverlayPress={this.hideValidation}
          />
          <AlertModal
            visible={this.state.showModal}
            title={strings.label_leave_title}
            subtitle={strings.label_leave_subtitle}
            text={strings.label_leave_text}
            image={Badges.leave}
            buttons={[this.cancelButton, this.leaveButton]}
            onOverlayPress={this.closeModal}
            onPress={this.closeModal}
          />
          {
            !this.props.trashPoint &&
            this.props.createTrashPoint.success && this.state.isCreateButtonPressed &&
            <AlertModal
              image={Badges.trashPointAdded}
              visible
              title={strings.label_trashpoint_created}
              subtitle={strings.label_thank_you_for_contr}
              text={''}
              buttons={[this.successCancelButton]}
            />
          }
          <LocationPicker
            onEditLocationPress={this.handleEditLocationPress}
            value={editableLocation}
            address={address}
            status={status}
          />
          {this.renderSectionHeader(strings.label_point_status_header)}
          <StatusPicker
            value={status}
            onChange={this.handleStatusChanged}
            display={this.props.trashPoint ?
              ['threat', 'regular', 'cleaned'] : ['threat', 'regular']}
          />
          {this.renderSectionHeader(strings.label_text_select_trash_amount)}
          <View style={styles.selectTrashPointTypeContainer}>
            <CustomSlider
              width={getWidthPercentage(264)}
              paddingHorizontal={20}
              maximumValue={3}
              initialValue={this.state.amount}
              step={1}
              onValueChange={this.handleAmountSelect}
              gradationData={[{
                position: getWidthPercentage(10.5),
                image: amount >= 0
                  ? HANDFUL_IMAGE_DATA.active
                  : HANDFUL_IMAGE_DATA.default,
                text:
                  <Text
                    key={strings.label_handful}
                    style={[styles.label, amount >= 0 ? { color: 'rgb(0, 143, 223)' } : {}]}
                  >
                    {strings.label_handful}
                  </Text>,
              }, {
                position: getWidthPercentage(91.2),
                image: amount >= 1
                  ? BAGFUL_IMAGE_DATA.active
                  : BAGFUL_IMAGE_DATA.default,
                text:
                  <Text
                    key={strings.label_bagful}
                    style={[styles.label, amount >= 1 ? { color: 'rgb(0, 143, 223)' } : {}]}
                  >
                    {strings.label_bagful}
                  </Text>,
              }, {
                position: getWidthPercentage(172),
                image: amount >= 2
                  ? CARTLOAD_IMAGE_DATA.active
                  : CARTLOAD_IMAGE_DATA.default,
                text:
                  <Text
                    key={strings.label_cartload}
                    style={[styles.label, amount >= 2 ? { color: 'rgb(0, 143, 223)' } : {}]}
                  >
                    {strings.label_cartload}
                  </Text>,
              }, {
                position: getWidthPercentage(253.2),
                image: amount >= 3
                  ? TRUCKLOAD_IMAGE_DATA.active
                  : TRUCKLOAD_IMAGE_DATA.default,
                text:
                  <Text
                    key={strings.label_truck}
                    style={[styles.label, amount >= 3 ? { color: 'rgb(0, 143, 223)' } : {}]}
                  >
                    {strings.label_truck}
                  </Text>,
              }]}
            />
          </View>
          {this.renderSectionHeader(strings.label_select_trash_type)}
          <Tags
            tags={trashCompositionTypes}
            onTagSelect={this.handleTrashCompositionTypeSelect}
          />
          {hashtags && hashtags.length > 0
          && this.renderSectionHeader(strings.label_additional_tags)}
          {hashtags && hashtags.length > 0 &&
          <Tags
            tags={hashtags}
            onTagDelete={this.handleHashtagDelete}
          />
          }
          {this.renderSectionHeader(strings.label_select_trash_origin)}
          <Tags
            isTooltipEnabled
            tags={trashOrigins}
            onTagSelect={this.handleTrashCompositionOriginSelect}
          />
          {this.renderSectionHeader(strings.label_add_additional_tags)}
          <View style={styles.additionalTagsContainer}>
            <TextInput
              style={styles.hashtagInput}
              placeholderStyle={styles.hashtagInputPlaceholder}
              placeholder={strings.label_text_createTP_add_hashtags_hint}
              onChangeText={this.handleChangeHashtagText}
              value={temporaryHashtag}
              underlineColorAndroid="transparent"
              maxLength={25}
            />
            <TouchableOpacity
              disabled={!this.state.temporaryHashtag}
              onPress={this.handleAddHahstag}
            >
              <View
                style={[styles.addButtonContainer,
                  this.state.temporaryHashtag
                    ? {} : { backgroundColor: 'rgb(126, 124, 132)' }]}
              >
                <Text style={[styles.addButtonPlus]}>
                  +
                </Text>
                <Text style={[styles.addButton]}>
                  {strings.label_add}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {this.renderSectionHeader(strings.label_text_createTP_add_photos
            .toLocaleUpperCase())}
          <View>
            <PhotoPicker
              maxPhotos={initialPhotos ? initialPhotos.length + 3 : 3}
              photos={shownPhotos}
              onDeletePress={this.handlePhotoDelete}
              onAddPress={this.handlePhotoAdd}
            />
          </View>
          {this.renderBottomComponents()}
        </ScrollView>
        {
          this.isProgressEnabled() &&
          <View style={styles.progressViewContainer}>
            {this.spinner()}
          </View>
        }
      </View>
    );
  }
}

BaseTrashpointEdit.propTypes = {
  createTrashPoint: PropTypes.object,
  isLoading: PropTypes.bool,
  navigator: PropTypes.object,
  isConnected: PropTypes.bool,
  photos: PropTypes.array,
  coords: PropTypes.object,
  trashPoint: PropTypes.object,
  onBackFromUpdate: PropTypes.func,
  getTrashPointOriginAction: PropTypes.func,
};

export default BaseTrashpointEdit;

