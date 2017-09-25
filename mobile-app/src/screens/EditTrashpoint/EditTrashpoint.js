import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { MessageBarManager } from 'react-native-message-bar';
import moment from 'moment';
import {
  StatusBar,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';
import { compose } from 'recompose';
import { translate } from 'react-i18next';

import { withNavigationHelpers } from '../../services/Navigation';

import { withCameraActions } from '../../services/Camera';
import { operations as locationOperations } from '../../reducers/location';
import { selectors as userSels } from '../../reducers/user';
import { Button } from '../../components/Buttons';
import { LocationPicker } from '../CreateMarker/components/LocationPicker';
import { StatusPicker } from '../CreateMarker/components/StatusPicker';
import { PhotoPicker } from '../../components/PhotoPicker';
import { Divider } from '../../components/Divider';
import { getWidthPercentage, getHeightPercentage, handleSentryError } from '../../shared/helpers';
import { Tags } from '../../components/Tags';
import { AmountPicker, AMOUNT_STATUSES } from '../../components/AmountPicker';
import { StatusText } from '../../components/StatusText';
import { TrashpointDate } from '../../components/TrashpointDate';
import { withLoadingScreen } from '../../services/Loading';
import { AlertModal } from '../../components/AlertModal';
import {
  TRASH_COMPOSITION_TYPE_LIST,
  MARKER_STATUSES,
  AMOUNT_HASH,
} from '../../shared/constants';
import {
  operations as trashpileOperations,
  selectors as trashpileSelectors,
} from '../../reducers/trashpile';
import { operations as appOps } from '../../reducers/app';
import styles from './styles';
import ImageService from './../../services/Image';
import _ from 'lodash';

const ALERT_CHECK_IMG = require('../CreateMarker/alert_check.png');

const MAX_HASHTAGS_NO = 15;
const GRADIENT_COLORS = ['#FFFFFF', '#F1F1F1'];
const PADDING_SIZE20 = getWidthPercentage(20);
const HEIGHT_SIZE15 = getHeightPercentage(15);
const HEIGHT_SIZE20 = getHeightPercentage(20);
const STATUS_PICKER_OPTIONS = [
  MARKER_STATUSES.REGULAR,
  MARKER_STATUSES.THREAT,
  MARKER_STATUSES.CLEANED,
];

class EditTrashpoint extends Component {
  static propTypes = {
    navigation: PropTypes.object.isRequired,
    updateTrashpoint: PropTypes.func.isRequired,
    congratsShown: PropTypes.bool,
    takePhotoAsync: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { marker } = props;

    const photos = _.has(marker, 'thumbnails')
      ? marker.thumbnails.map(t => ({ ...t, uri: t.url }))
      : [];
    this.state = {
      photos: [...photos],
      temporaryHashtag: '',
      amount: AMOUNT_STATUSES[marker.amount],
      status: marker.status,
      congratsShown: false,
      trashCompositionTypes: TRASH_COMPOSITION_TYPE_LIST.map(
        (trashCompositionType) => {
          return {
            ...trashCompositionType,
            selected: marker.composition.indexOf(trashCompositionType.type) !== -1,
          };
        },
      ),
      hashtags: [...marker.hashtags.map(label => ({ label }))],
      initialLocation: marker.latlng,
      editableLocation: marker.latlng,
      address: {},
      deletedPhotos: [],
      disableEditTrashpointButton: false
    };
    this.state.maxPhotos = this.state.photos.length + 3;

    this.closeValidationButton = {
      text: props.t('label_button_acknowledge'),
      onPress: this.hideValidation,
    };
  }

  componentWillMount() {
    this.fetchAddressAsync(this.props.marker.latlng);
  }

  fetchAddressAsync = async (coords) => {
    const address = await locationOperations.fetchAddress(
      coords || this.state.initialLocation,
    );
    this.setState({ address });
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

  shouldRenderDelete = () => {
    const { marker, authUser } = this.props;
    if (!marker || !marker.id) {
      return false;
    }
    if (marker.createdBy !== authUser.id) {
      return false;
    }
    const hourDiff = Math.abs(moment().diff(moment(marker.createdAt), 'hours'));
    if (hourDiff >= 24) {
      return false;
    }
    return true;
  };

  handleEditLocationPress = () => {
    const { initialLocation, status, address } = this.state;
    this.props.navigation.navigate('EditLocation', {
      status,
      initialLocation,
      address,
      onGoBack: (coords) => {
        this.setState(
          { editableLocation: coords },
          async () => await this.fetchAddressAsync(coords),
        );
      },
    });
  };

  handlePhotoAdd = () => {
    this.props
        .takePhotoAsync({ quality: 0.2, base64: true })
        .then(async (response) => {
          if (!response) {
            return;
          }
          const { cancelled, uri, base64, width, height } = response;

          if (cancelled) {
            return;
          }

          const { photos } = this.state;
          const thumbnailBase64 = await ImageService.getResizedImageBase64({
            uri,
            width,
            height,
          });
          this.setState({
            photos: [
              ...photos,
              { uri, base64, thumbnail: { base64: thumbnailBase64 } },
            ],
            statusChanged: false,
          });
        })
        .catch((err) => handleSentryError(err));
  };

  handlePhotoDelete = (index) => {
    const { photos } = this.state;
    if (photos[index].parentId) {
      const [deletedPhoto] = photos.splice(index, 1);
      this.setState({
        photos,
        deletedPhotos: [...this.state.deletedPhotos, deletedPhoto],
      });
    } else {
      photos.splice(index, 1);
      this.setState({
        photos,
      });
    }
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
    const { photos, trashCompositionTypes, statusChanged } = this.state;
    if (
      !photos ||
      photos.length === 0 ||
      !trashCompositionTypes.find(type => type.selected) ||
      statusChanged
    ) {
      this.showValidation(this.props.t('label_error_saveTP_pic_and_type'));
      return false;
    }
    return true;
  }

  handleTrashpointUpdate = async () => {
    const {
      updateTrashpoint,
      navigation,
      marker,
      setErrorMessage,
      t,
    } = this.props;
    const {
      photos,
      trashCompositionTypes,
      hashtags,
      status = MARKER_STATUSES.REGULAR,
      amount,
      address: { completeAddress = '', streetAddress = '', streetNumber = '' },
      deletedPhotos,
    } = this.state;

    if (!this.validate()) {
      return;
    }

    this.setState({ disableEditTrashpointButton: true }, () => {
      const deletedImagePromises = deletedPhotos.map((dp) => {
        return trashpileOperations.deleteImage(this.props.marker.id, dp.parentId);
      });
      Promise.all(deletedImagePromises).then(() => {
        updateTrashpoint({
          location: this.state.editableLocation,
          status,
          photos,
          composition: [
            ...trashCompositionTypes.filter(t => t.selected).map(t => t.type),
          ],
          hashtags: [...hashtags.map(t => t.label)],
          amount: AMOUNT_STATUSES[amount],
          address: completeAddress,
          name: `${streetAddress} ${streetNumber}`,
          id: marker.id,
          oldMarkerPhotos: marker.photos,
        }).then(
          (res) => {
            if (res) {
              if (!res.photoStatus) {
                setErrorMessage(t('label_edit_marker_missing_photos'));
              }
              this.props.fetchMarkerDetails(marker.id).then(() => {
                navigation.goBack(null);
                setTimeout(() =>
                  this.showSuccessAlert(this.props.t('label_alert_editTP_edit')),
                );
              });
            }
          },
          err => console.log(err),
        );
      });
    });
  };

  handleStatusChanged = (status) => {
    this.setState({
      status,
      statusChanged: this.props.marker.status !== status,
    });
  };

  handleAddHahstag = () => {
    const { hashtags, temporaryHashtag } = this.state;

    if (hashtags.length === MAX_HASHTAGS_NO) {
      return;
    }

    let label = temporaryHashtag.replace(/[^0-9a-z]/gi, '');

    if (!label) {
      return;
    }

    label = `#${label}`;

    const hashtagAlreadyExists = hashtags.find(
      hashtag => hashtag.label === label,
    );

    if (hashtagAlreadyExists) {
      return this.setState({
        temporaryHashtag: '',
      });
    }

    this.setState({
      hashtags: [...hashtags, { label }],
      temporaryHashtag: '',
    });
  };

  showSuccessAlert = (message) => {
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

  handleChangeHashtagText = (text) => {
    this.setState({ temporaryHashtag: text });
  };

  handleAmountSelect = (amount) => {
    this.setState({
      amount: AMOUNT_STATUSES[amount],
    });
  };

  handleDeletePress = () => {
    const { marker, navigation } = this.props;
    if (!marker) {
      return;
    }
    this.props.deleteMarker({ markerId: marker.id }).then((res) => {
      if (res) {
        this.showSuccessAlert(this.props.t('label_alert_editTP_delete'));
        navigation.resetTo('Tabs');
      }
    });
  };

  render() {
    const {
      trashCompositionTypes,
      status,
      hashtags,
      temporaryHashtag,
      amount = AMOUNT_STATUSES.handful,
      validation = false,
      validationText,
      initialLocation,
      editableLocation,
      address = {},
      photos,
      disableEditTrashpointButton,
    } = this.state;
    const { marker } = this.props;
    const addHashtagTextStyle = {};
    if (hashtags.length === MAX_HASHTAGS_NO) {
      addHashtagTextStyle.color = GRADIENT_COLORS[1];
    }

    return (
      <KeyboardAvoidingView behavior="position">
        <ScrollView style={{ backgroundColor: '#eeeeee' }}>
          <StatusBar translucent barStyle="default" />

          <AlertModal
            visible={validation}
            title={this.props.t('label_error_saveTP_subtitle')}
            subtitle={validationText}
            buttons={[this.closeValidationButton]}
            onOverlayPress={this.hideValidation}
          />

          <LocationPicker
            onEditLocationPress={this.handleEditLocationPress}
            value={editableLocation}
            address={address}
            status={status}
          />
          <View
            style={{
              backgroundColor: 'white',
              paddingHorizontal: PADDING_SIZE20,
              paddingBottom: HEIGHT_SIZE20,
            }}
          >
            <Divider customStyles={{ backgroundColor: '#D9D9D9' }} />
            <StatusText status={status} />
            <TrashpointDate
              createdDate={marker.createdAt}
              updatedDate={marker.updatedAt || marker.createdAt}
              createdBy={marker.createdByName}
              updatedBy={marker.updatedByName || marker.createdByName}
            />
          </View>
          <Divider />
          <StatusPicker
            value={status}
            onChange={this.handleStatusChanged}
            display={STATUS_PICKER_OPTIONS}
          />
          <Divider />

          <View>
            <PhotoPicker
              maxPhotos={this.state.maxPhotos}
              photos={photos.map(({ uri }) => uri)}
              onDeletePress={this.handlePhotoDelete}
              onAddPress={this.handlePhotoAdd}
            />
          </View>
          <Divider />
          <View style={{ padding: getWidthPercentage(20) }}>
            <Text style={{ fontFamily: 'noto-sans-bold', fontSize: 16 }}>
              {this.props.t('label_text_createTP_select_amount')}
            </Text>
            <AmountPicker amount={amount} onSelect={this.handleAmountSelect} />
            <View
              style={{
                paddingTop: HEIGHT_SIZE20,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: '#3E8EDE',
                  fontFamily: 'noto-sans-bold',
                  fontSize: 13,
                }}
              >
                {AMOUNT_HASH[AMOUNT_STATUSES[amount]]}
              </Text>
            </View>
          </View>
          <Divider />
          <View style={styles.tagsContainer}>
            <Text style={styles.trashtypesText}>
              {this.props.t('label_text_createTP_select_type')}
            </Text>
            <Tags
              tags={trashCompositionTypes}
              onTagSelect={this.handleTrashCompositionTypeSelect}
            />
            <Text style={[styles.trashtypesText, { marginTop: HEIGHT_SIZE15 }]}>
              {this.props.t('label_text_createTP_add_hashtags')}
            </Text>
            <Tags tags={hashtags} onTagDelete={this.handleHashtagDelete} />
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.hashtagInput}
                placeholderStyle={styles.hashtagInputPlaceholder}
                placeholder={this.props.t(
                  'label_text_createTP_add_hashtags_hint',
                )}
                onChangeText={this.handleChangeHashtagText}
                value={temporaryHashtag}
                underlineColorAndroid="transparent"
                maxLength={25}
                onSubmitEditing={this.handleAddHahstag}
              />
            </View>
          </View>
          <Divider />
          {/* <View style={{ padding: PADDING_SIZE20 }}>*/}
          {/* <Text style={styles.trashtypesText}>*/}
          {/* Something extra to report*/}
          {/* </Text>*/}
          {/* <Text style={styles.notesText}>*/}
          {/* Is this garbage in a difficult place to reach, a recurring dumping*/}
          {/* zone or something else?*/}
          {/* </Text>*/}
          {/* <View style={styles.containerBtnNote}>*/}
          {/* <TouchableHighlight*/}
          {/* onPress={() => {}}*/}
          {/* underlayColor="transparent"*/}
          {/* activeOpacity={1}*/}
          {/* >*/}
          {/* <View style={[styles.addTagContainer]}>*/}
          {/* <LinearGradient*/}
          {/* style={styles.addReportLinearGradient}*/}
          {/* colors={GRADIENT_COLORS}*/}
          {/* >*/}
          {/* <Text style={styles.addTagText}>*/}
          {/* Leave a note*/}
          {/* </Text>*/}
          {/* </LinearGradient>*/}
          {/* </View>*/}
          {/* </TouchableHighlight>*/}
          {/* </View>*/}
          {/* </View>*/}
          {/* <Divider />*/}
          <View style={styles.bottomContainer}>
            <Button
              style={styles.createButton}
              text={this.props.t('label_button_editTP_save')}
              onPress={this.handleTrashpointUpdate}
              disabled={disableEditTrashpointButton}
            />
            {this.shouldRenderDelete() &&
            <TouchableOpacity onPress={this.handleDeletePress}>
              <Text style={styles.deleteButton}>
                {this.props.t('label_button_editTP_delete')}
              </Text>
            </TouchableOpacity>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    marker: trashpileSelectors.markerDetailsSelector(state),
    loading: trashpileSelectors.isLoading(state),
    markerDeleting: trashpileSelectors.getMarkerDeleting(state),
    authUser: userSels.getProfile(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateTrashpoint(marker) {
      return dispatch(trashpileOperations.createMarker(marker, true));
    },
    fetchMarkerDetails(markerId) {
      return dispatch(trashpileOperations.fetchMarkerDetails(markerId));
    },
    setErrorMessage: (...args) => dispatch(appOps.setErrorMessage(...args)),
    deleteMarker: (...args) =>
      dispatch(trashpileOperations.deleteMarker(...args)),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withNavigationHelpers(),
  withLoadingScreen(props => props.loading || props.markerDeleting, {
    compact: false,
  }),
  withCameraActions(),
  translate(),
)(EditTrashpoint);
