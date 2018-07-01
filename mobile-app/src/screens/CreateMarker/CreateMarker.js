import React from 'react';
import _ from 'lodash';
import ImagePicker from 'react-native-image-crop-picker';
import { ActivityIndicator,
  Alert,
  BackHandler,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View } from 'react-native';
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
import { CLIENT_ERRORS, MARKER_STATUSES, TRASH_COMPOSITION_TYPE_LIST } from '../../shared/constants';
import { Badges } from '../../assets/images';

import styles from './styles';
import { geocodeCoordinates, getCurrentPosition } from '../../shared/geo';

import { ADD_LOCATION, CREATE_MARKER } from '../index';
import { checkConnection, getWidthPercentage } from '../../shared/helpers';
import { createTrashPointOfflineAction } from '../../store/actions/trashPoints';

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

class CreateMarker extends React.Component {
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

    const { photos, coords } = props;

    const state = {
      photos: [...photos],
      temporaryHashtag: '',
      amount: AMOUNT_STATUSES.handful,
      status: MARKER_STATUSES.REGULAR,
      congratsShown: false,
      trashCompositionTypes: TRASH_COMPOSITION_TYPE_LIST.map(
        trashCompositionType => ({
          ...trashCompositionType,
          selected: false,
        }),
      ),
      hashtags: [],
      initialLocation: coords,
      editableLocation: coords,
      address: {},
      disableCreateTrashpointButton: false,
      locationSetByUser: false,
      isCreateButtonPressed: false,
      isSuccessDialogShown: false,
    };

    this.state = state;

    this.redirectSettingsButton = {
      text: strings.label_button_acknowledge,
      onPress: this.hideValidation,
    };

    this.successCancelButton = {
      text: strings.label_button_cancel,
      onPress: this.successCancel.bind(this),
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
    this.handleTrashpointCreate = _.debounce(
      this.handleTrashpointCreate,
      2000,
      {
        leading: true,
        trailing: false,
      },
    );

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  async componentWillMount() {
    await this.fetchAddressAsync();

    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillReceiveProps(nextProps) {
    const { isConnected: wasConnected } = this.props;
    const { isConnected } = nextProps;
    const { address, locationSetByUser } = this.state;
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
      throw new Error(this.props.createTrashPoint.error);
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  onNavigatorEvent = (event) => {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case cancelId: {
          this.props.navigator.pop();
          break;
        }
        default:
      }
    }
  }

  onLocationSelected = (location) => {
    this.setState((previousState) => {
      return {
        ...previousState,
        editableLocation: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        address: location.place,
      };
    });
  }

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
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radlat1) * Math.cos(radlat2);
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

    const { coords } = await getCurrentPosition({
      enableHighAccuracy: false,
      timeout: 10 * 1000,
      maximumAge: 60 * 1000,
    });

    this.props.navigator.pop();

    this.props.navigator.push({
      screen: CREATE_MARKER,
      title: strings.label_button_createTP_confirm_create,
      passProps: {
        photos: [{ uri, thumbnail: { base64: thumbnailBase64 }, base64 }],
        coords,
      },
    });
  };

  successCancel = () => {
    this.props.navigator.pop();
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
    this.props.navigator.push({
      screen: ADD_LOCATION,
      title: strings.label_header_edit_loc,
      passProps: {
        initialLocation,
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
          { uri,
            base64: data,
            thumbnail: { base64: thumbnailBase64 },
          }],
      };
    });
  };

  handlePhotoDelete = (index) => {
    const { photos } = this.state;
    photos.splice(index, 1);
    this.setState({
      photos,
    });
  };

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

  handleHashtagDelete = index => () => {
    this.setState({
      hashtags: [
        ...this.state.hashtags.slice(0, index),
        ...this.state.hashtags.slice(index + 1),
      ],
    });
  };

  validate() {
    const { photos, trashCompositionTypes } = this.state;
    if (!photos
            || photos.length === 0
            || !trashCompositionTypes.find(type => type.selected)
    ) {
      this.showValidation(strings.label_error_saveTP_pic_and_type);
      return false;
    }
    const distance = this.calcCrow(
      this.state.initialLocation.latitude,
      this.state.initialLocation.longitude,
      this.state.editableLocation.latitude,
      this.state.editableLocation.longitude,
    );
    if (distance >= 0.1) {
      this.showValidation(strings.label_error_editTP_out_of_rng_text);
      return false;
    }
    return true;
  }

  handleTrashpointCreate = () => {
    const {
      photos,
      trashCompositionTypes,
      hashtags,
      status = MARKER_STATUSES.REGULAR,
      amount,
      address,
    } = this.state;
    const team = this.props.teamId;
    if (!this.validate()) {
      return;
    }
    this.setState((previousState) => {
      return {
        ...previousState,
        disableCreateTrashpointButton: true,
        isCreateButtonPressed: true,
      };
    }, async () => {
      if (!await checkConnection()) {
        this.props.createTrashPointOfflineAction(
          [...hashtags.map(t => t.label)],
          [...trashCompositionTypes.filter(t => t.selected).map(t => t.type)],
          this.state.editableLocation,
          status,
          address,
          AMOUNT_STATUSES[amount],
          address,
          photos,
          team
        );
        return;
      }
      this.props.createTrashPointAction(
        [...hashtags.map(t => t.label)],
        [...trashCompositionTypes.filter(t => t.selected).map(t => t.type)],
        this.state.editableLocation,
        status,
        address,
        AMOUNT_STATUSES[amount],
        address,
        photos,
        team
      );
    });
  };

  handleStatusChanged = (status) => {
    this.setState({
      status,
    });
  };

  handleAddHahstag = () => {
    const { hashtags, temporaryHashtag } = this.state;

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
        temporaryHashtag: '',
      });
    }

    this.setState({
      hashtags: [...hashtags, ...labels.map(label => ({ label }))],
      temporaryHashtag: '',
    });
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

  renderSectionHeader(text) {
    return (
      <Text style={styles.headerSection}>
        {text}
      </Text>
    );
  }
  render() {
    const {
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
    return (
      <View>
        <ScrollView
          pointerEvents={this.isProgressEnabled() ? 'none' : 'auto'}
          style={styles.scrollView}
        >
          <AlertModal
            visible={validation}
            title={'Oh noes!'}
            subtitle={'It’s an error!'}
            text={strings.label_error_saveTP_pic_and_type}
            image={Badges.trashPointValidation}
            buttons={[]}
            onOverlayPress={this.hideValidation}
          />
          {this.props.createTrashPoint.success && this.state.isCreateButtonPressed &&
            <AlertModal
              image={Badges.trashPointAdded}
              visible
              title={'Trashpoint created'}
              subtitle={strings.label_thank_you_for_contr}
              text={strings.label_add_more_trashpoints}
              buttons={[this.successCancelButton, this.registerButton]}
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
          />
          {this.renderSectionHeader(strings.label_text_select_trash_amount)}
          <View style={styles.selectTrashPointTypeContainer}>
            <CustomSlider
              width={getWidthPercentage(264)}
              paddingHorizontal={20}
              maximumValue={3}
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
              disabled={this.state.temporaryHashtag.length === 0}
              onPress={this.handleAddHahstag}
            >
              <View
                style={[styles.addButtonContainer, this.state.temporaryHashtag.length > 0
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
              maxPhotos={3}
              photos={photos.map(({ uri }) => uri)}
              onDeletePress={this.handlePhotoDelete}
              onAddPress={this.handlePhotoAdd}
            />
          </View>
          <View style={styles.createTrashPointButtonContainer}>
            <TouchableOpacity
              onPress={this.handleTrashpointCreate}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>
                {strings.label_button_createTP_confirm_create}
              </Text>
            </TouchableOpacity>
          </View>
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

CreateMarker.propTypes = {
  createTrashPoint: PropTypes.object,
  isLoading: PropTypes.bool,
  createTrashPointAction: PropTypes.func,
  navigator: PropTypes.object,
  isConnected: PropTypes.bool,
  photos: PropTypes.array,
  coords: PropTypes.object,
};

export default CreateMarker;

