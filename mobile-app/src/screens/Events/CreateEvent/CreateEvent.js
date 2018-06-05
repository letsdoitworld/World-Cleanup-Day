import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';
import { Navigation } from 'react-native-navigation';
import Permissions from 'react-native-permissions';
import isEmpty from 'lodash/isEmpty';
import styles from './styles';
import strings from '../../../assets/strings';
import MainButton from '../../../components/Buttons/MainButton';
import InputField from '../../../components/InputFields/InputField';
import constants from '../../../shared/constants';
import * as Immutable from '../../../../node_modules/immutable/dist/immutable';
import { AlertModal } from '../../../components/AlertModal';

import { ADD_COORDINATOR, ADD_LOCATION, ADD_TRASH_POINTS } from '../../index';
import ImmutableComponent from '../../../components/InputFields/ImmutableComponent';

import { Icons, Badges, ButtonDelete } from '../../../assets/images';
import ImageService from '../../../services/Image';
import { navigatorStyle } from './config';

const cancelId = 'cancel';

export default class CreateEvent extends ImmutableComponent {
  static navigatorStyle = navigatorStyle;

  static navigatorButtons = {
    leftButtons: [
      {
        icon: Icons.Close,
        id: cancelId,
      },
    ],
  };

  title = '';
  description = '';
  date = '';
  startTime = '';
  endTime = '';
  whatToBring = '';

  constructor(props) {
    super(props);
    this.title = '';
    this.description = '';
    this.whatToBring = '';

    this.state = {
      showModal: false,
      photos: [],
      data: Immutable.Map({
        isTitleValid: false,
        isTitleTextChanged: false,
        isDescriptionValid: false,
        isDescriptionTextChanged: false,
        isWhatToBringValid: false,
        isWhatToBringTextChanged: false,
        isStartDateValid: true,
        isEndDateValid: true,
        isLocationValid: false,
        isLocationChanged: false,
        isDateTimePickerVisible: false,
        startDate: this.calculateMinDate(),
        endDate: this.calculateMinDate(),
        selectedLocation: undefined,
        trashPointsCount: 0,
        trashPoints: [],
        height: 0,
        heightWTB: 0,
      }),
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case cancelId: {
          this.openModal();
          break;
        }
        default:
      }
    }
  }

  updateSize = (height) => {
    this.setState({
      height,
    });
  };

  updateWTBSize = (heightWTB) => {
    this.setState({
      heightWTB,
    });
  };

  back() {
    Navigation.dismissAllModals();
  }
  openModal = () => {
    this.setState({ showModal: true });
  }
  closeModal = () => {
    this.setState({ showModal: false });
  }
  leave = () => {
    this.back();
  }
  cancelButton = {
    text: strings.label_button_cancel,
    onPress: this.closeModal,
  };
  leaveButton = {
    text: strings.label_button_leave,
    onPress: this.leave,
  };
  calculateMinDate = () => {
    const date = new Date();
    return Moment(date).format('DD-MM-YYYY HH:mm');
  }

  renderStartPicker = () => {
    const startDate = this.state.data.get('startDate');
    const minDate = this.calculateMinDate();
    return <DatePicker
      style={styles.datePickerContainer}
      date={startDate}
      mode="datetime"
      format="DD-MM-YYYY HH:mm"
      confirmBtnText="Confirm"
      cancelBtnText="Cancel"
      minDate={minDate}
      maxDate="01-01-2060"
      showIcon={false}
      customStyles={{ dateInput: { borderWidth: 0 } }}
      onDateChange={(date) => {
        const endDate = this.state.data.get('endDate');
        this.setData(d => d.set('startDate', date));
        const endDateTime = Moment(endDate, 'DD-MM-YYYY HH:mm').toDate();
        const startDateTime = Moment(date, 'DD-MM-YYYY HH:mm').toDate();
        let changedEndDate = `${date
          .split(' ')[0]} ${parseInt(date
          .split(' ')[1].split(':')[0], 10) + 1}:${endDate.split(' ')[1].split(':')[1]}`;
        if (date.split(' ')[0] !== endDate.split(' ')[0]) {
          changedEndDate = `${date
            .split(' ')[0]} ${parseInt(date
            .split(' ')[1].split(':')[0], 10) + 1}:
            ${endDate.split(' ')[1].split(':')[1]}`;
        }
        if (endDateTime > startDateTime) {
          changedEndDate = `${date.split(' ')[0]} ${endDate.split(' ')[1]}`;
        }
        this.setData(d => d.set('endDate', changedEndDate));
        this.validateEndTime(date, changedEndDate);
      }}
    />;
  }

  renderTitle = () => {
    const isTitleValid = this.state.data.get('isTitleValid');
    const isTitleTextChanged = this.state.data.get('isTitleTextChanged');
    const style = (isTitleValid && isTitleTextChanged)
      || (!isTitleValid && !isTitleTextChanged)
      ? styles.titleTextStyle
      : styles.titleErrorTextStyle;
    return <View style={styles.titleStyle}>
      <Text style={style}>{strings.label_title.toUpperCase()}</Text>
    </View>;
  }

  renderDateTitle = () => {
    const isEndDateValid = this.state.data.get('isEndDateValid');
    const style = (isEndDateValid) ? styles.titleTextStyle : styles.titleErrorTextStyle;
    return <View style={styles.titleStyle}>
      <Text style={style}>{strings.label_date_and_time.toUpperCase()}</Text>
    </View>;
  }

  renderDescriptionTitle = () => {
    const isDescriptionValid = this.state.data.get('isDescriptionValid');
    const isDescriptionTextChanged = this.state.data.get('isDescriptionTextChanged');
    const style = (isDescriptionValid && isDescriptionTextChanged)
      || (!isDescriptionValid && !isDescriptionTextChanged)
      ? styles.titleTextStyle
      : styles.titleErrorTextStyle;
    return <View style={styles.titleStyle}>
      <Text style={style}>{strings.label_description.toUpperCase()}</Text>
    </View>;
  }

  renderWhatToBringTitle = () => {
    const isWhatToBringValid = this.state.data.get('isWhatToBringValid');
    const isWhatToBringTextChanged = this.state.data.get('isWhatToBringTextChanged');
    const style = (isWhatToBringValid && isWhatToBringTextChanged)
      || (!isWhatToBringValid && !isWhatToBringTextChanged)
      ? styles.titleTextStyle
      : styles.titleErrorTextStyle;
    return <View style={styles.titleStyle}>
      <Text style={style}>{strings.label_what_to_bring_with_you.toUpperCase()}</Text>
    </View>;
  };

  renderLocationTitle = () => {
    const isLocationValid = this.state.data.get('isLocationValid');
    const isLocationChanged = this.state.data.get('isLocationChanged');
    const style = (isLocationValid && isLocationChanged)
      || (!isLocationValid && !isLocationChanged)
      ? styles.titleTextStyle
      : styles.titleErrorTextStyle;
    return <View style={styles.titleStyle}>
      <Text style={style}>{strings.label_location.toUpperCase()}</Text>
    </View>;
  };

  renderTitleError = () => {
    const isTitleValid = this.state.data.get('isTitleValid');
    const isTitleTextChanged = this.state.data.get('isTitleTextChanged');
    if (!isTitleValid && isTitleTextChanged) {
      return (
        <Text style={styles.textErrorStyle}>
          {strings.label_invalid_event_field}
        </Text>
      );
    }
  }

  renderDateError = () => {
    const isEndDateValid = this.state.data.get('isEndDateValid');
    if (!isEndDateValid) {
      return (
        <Text style={styles.textErrorStyle}>
          {strings.label_invalid_event_date}
        </Text>
      );
    }
  }

  renderDescriptionError = () => {
    const isDescriptionValid = this.state.data.get('isDescriptionValid');
    const isDescriptionTextChanged = this.state.data.get('isDescriptionTextChanged');
    if (!isDescriptionValid && isDescriptionTextChanged) {
      return (
        <Text style={styles.textErrorStyle}>
          {strings.label_description}{strings.label_invalid_event_description}
        </Text>
      );
    }
  }

  renderWhatToBringError = () => {
    const isWhatToBringValid = this.state.data.get('isWhatToBringValid');
    const isWhatToBringTextChanged = this.state.data.get('isWhatToBringTextChanged');
    if (!isWhatToBringValid && isWhatToBringTextChanged) {
      return (
        <Text style={styles.textErrorStyle}>
          {strings.label_what_to_bring_with_you}{strings.label_invalid_event_description}
        </Text>
      );
    }
  }

  renderLocationError = () => {
    const isLocationValid = this.state.data.get('isLocationValid');
    const isLocationChanged = this.state.data.get('isLocationChanged');
    if (!isLocationValid && isLocationChanged) {
      return (
        <Text style={styles.textErrorStyle}>
          {strings.label_location}{strings.label_invalid_location}
        </Text>
      );
    }
  }

  renderEndPicker = () => {
    const endDate = this.state.data.get('endDate');
    const startTime = this.state.data.get('startDate');
    const endDateTime = Moment(endDate, 'DD-MM-YYYY HH:mm').toDate();
    const startDateTime = Moment(startTime, 'DD-MM-YYYY HH:mm').toDate();
    let setDate = endDate;
    if (startDateTime >= endDateTime) {
      setDate = `${endDate
        .split(' ')[0]} ${parseInt(endDate
        .split(' ')[1].split(':')[0], 10) + 1}:${endDate.split(' ')[1].split(':')[1]}`;
    }
    const minDate = this.calculateMinDate();
    return <DatePicker
      style={styles.datePickerContainer}
      mode="time"
      date={setDate}
      format="DD-MM-YYYY HH:mm"
      confirmBtnText="Confirm"
      cancelBtnText="Cancel"
      showIcon={false}
      minDate={minDate}
      maxDate="01-01-2060"
      customStyles={{ dateInput: { borderWidth: 0 } }}
      onDateChange={(date) => {
        const startDate = this.state.data.get('startDate');
        const newEndDate = `${startDate.split(' ')[0]} ${date.split(' ')[1]}`;
        this.setData(d => d.set('endDate', newEndDate));
        this.validateEndTime(startDate, newEndDate);
      }}
    />;
  }

  renderImage = (imagePath) => {
    if (imagePath !== '') {
      return <Image style={styles.photoIconStyle} source={{ uri: imagePath }} />;
    }
  }

  render() {
    const isTitleValid = this.state.data.get('isTitleValid');
    const isDescriptionValid = this.state.data.get('isDescriptionValid');
    const isWhatToBringValid = this.state.data.get('isWhatToBringValid');
    const isStartDateValid = this.state.data.get('isStartDateValid');
    const isEndDateValid = this.state.data.get('isEndDateValid');
    const isLocationValid = this.state.data.get('isLocationValid');
    const photos = this.state.photos;
    const imagePath = (photos.length > 0) ? photos[0].uri : '';
    const { height } = this.state;
    const isValid = isTitleValid && isDescriptionValid && isWhatToBringValid
            && isStartDateValid && isEndDateValid && isLocationValid;
    const newStyle = {
      height,
    };
    const newStyleWTB = {
      height,
    };
    return (
      <View>
        <ScrollView
          ref="scrollView"
          style={styles.container}
        >
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
          {this.renderTitle()}
          <View style={Platform.OS === 'android'
            ? [styles.inputContainerStyle, newStyle]
            : styles.inputContainerStyle}
          >
            <InputField
              style={styles.inputTextStyle}
              placeholder={strings.label_title_hint}
              autoCorrect={false}
              validate={this.validateTitle}
              multiline
              maxLength={70}
              onChangeText={this.onTitleTextChanged}
              onContentSizeChange={e => this.updateSize(e.nativeEvent.contentSize.height)}
            />
          </View>
          {this.renderTitleError()}
          {this.renderDateTitle()}
          <View style={styles.dateContainer}>
            <View style={styles.imageContainer}>
              <Image
                source={require('../../../assets/images/icons/ic_time.png')}
                style={styles.imageItemStyle}
              />
            </View>
            <View style={styles.dateAndTimeContainerStyle}>
              <View style={styles.dateAndTimeRowStyle}>
                <Text style={styles.dateTitleTextStyle}>{strings.label_start}</Text>
                {this.renderStartPicker()}
              </View>
              <View style={styles.dividerStyle} />
              <View style={styles.dateAndTimeRowStyle}>
                <Text style={styles.dateTitleTextStyle}>{strings.label_end}</Text>
                {this.renderEndPicker()}
              </View>
            </View>
          </View>
          {this.renderDateError()}
          {this.renderLocationTitle()}
          <TouchableOpacity onPress={this.onAddLocationClick}>
            <View style={styles.locationContainerStyle}>
              <Image
                source={require('../../../../src/assets/images/ic_location.png')}
                style={styles.imageTrashStyle}
              />
              {
                (this.state.data.get('selectedLocation') === undefined)
                  ? (
                    <Text style={styles.textTrashStyle}>
                      {strings.label_add_location}
                    </Text>
                  )
                  : <Text style={styles.textTrashStyle}>
                    {this.state.data.get('selectedLocation').place}
                  </Text>
              }
            </View>
          </TouchableOpacity>
          {this.renderLocationError()}
          <View style={styles.titleStyle}>
            <Text style={styles.titleTextStyle}>
              {strings.label_trashpoints.toUpperCase()}
            </Text>
          </View>
          {
            (this.state.data.get('selectedLocation') === undefined) ?
              <View style={styles.trashpointTipStyle}>
                <Image
                  source={require('../../../assets/images/ic_trashpoints.png')}
                  style={styles.imageTrashStyle}
                />
                <Text style={styles.textTrashStyle}>
                  {strings.label_tip_add_trashpoints}
                </Text>
              </View>
              :
              <TouchableOpacity onPress={this.onAddTrashPointsClick}>
                <View style={styles.locationContainerStyle}>
                  <Image
                    source={require('../../../assets/images/ic_trashpoints.png')}
                    style={styles.imageTrashStyle}
                  />
                  <Text style={styles.textTrashStyle}>
                    {
                      this.trashPoints.size > 0
                        ? strings.label_add_trashPoints_included
                        : strings.label_add_trashPoints
                    }
                  </Text>
                  {this.renderTrashPointsCount()}
                </View>
              </TouchableOpacity>
          }
          {this.renderDescriptionTitle()}
          <View style={styles.descriptionContainerStyle}>
            <InputField
              style={styles.inputTextStyle}
              placeholder={strings.label_ignite_people_to_participate}
              underlineColorAndroid={'transparent'}
              autoCorrect={false}
              multiline
              validate={this.validateDescription}
              maxLength={500}
              onChangeText={this.onDescriptionTextChanged}
            />
          </View>
          {this.renderDescriptionError()}
          {this.renderWhatToBringTitle()}
          <View
            style={Platform.OS === 'android'
              ? [styles.whatBringContainerStyle, newStyleWTB]
              : styles.whatBringContainerStyle}
          >
            <InputField
              style={styles.inputTextStyle}
              placeholder={strings.label_specify_tools_for_work}
              underlineColorAndroid={'transparent'}
              autoCorrect={false}
              multiline
              validate={this.validateWhatToBring}
              maxLength={500}
              onChangeText={this.onWhatToBringTextChanged}
              onContentSizeChange={e =>
                this.updateWTBSize(e.nativeEvent.contentSize.height)}
            />
          </View>
          {this.renderWhatToBringError()}
          <View style={styles.titleStyle}>
            <Text style={styles.titleTextStyle}>
              {strings.label_cover_photo.toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.eventTouchAreaStyle}
            onPress={() => this.showChoosedDialog()}
          >
            <View style={styles.eventPhotoContainerStyle}>
              {this.renderImage(imagePath)}
              {isEmpty(this.state.photos) &&
              <View>
                <Image
                  style={styles.addPhotoIconStyle}
                  source={require('../../../assets/images/ic_add_photo.png')}
                />
                <Text style={styles.addPhotoTextStyle}>{strings.label_add_photo}</Text>
              </View>
              }
              {!isEmpty(this.state.photos) &&
              <View style={styles.imageCircle}>
                <TouchableOpacity
                  style={styles.closeTouchAreaStyle}
                  onPress={() => this.clearImageData()}
                >
                  <Image source={ButtonDelete} style={styles.deleteButton} />
                </TouchableOpacity>
              </View>}
            </View>
          </TouchableOpacity>

          <MainButton
            isValid={isValid}
            text={strings.label_next}
            style={styles.nextButtonStyle}
            onPress={() => this.onNextClick(isValid)}
          />
        </ScrollView>
      </View>
    );
  }

  renderTrashPointsCount = () => {
    if (this.trashPoints.size > 0) {
      return (
        <View style={styles.trashPointCircle}>
          <Text style={styles.trashPointCount}>
            {this.trashPoints.size.toString()}
          </Text>
        </View>
      );
    } return null;
  }

  showChoosedDialog = () => {
    Alert.alert(
      'Add photo',
      'Add photo to event!',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        { text: 'Take photo', onPress: () => this.openCamera() },
        { text: 'From Gallery', onPress: () => this.openGallery() },
      ],
      { cancelable: true },
    );
  };

  openGallery = async () => {
    let permission = await Permissions.check('photo').then((response) => {
      return response;
    });
    if (permission === 'undetermined') {
      permission = await Permissions.request('photo').then((response) => {
        return response;
      });
    }
    if (permission !== 'authorized') {
      return;
    }
    ImagePicker.openPicker({
      width: 500,
      height: 350,
      cropping: true,
      includeBase64: true,
    }).then(async (image) => {
      this.setImageData(image);
    });
  }

  openCamera = async () => {
    let permission = await Permissions.check('camera').then((response) => {
      return response;
    });
    if (permission === 'undetermined') {
      permission = await Permissions.request('camera').then((response) => {
        return response;
      });
    }
    if (permission !== 'authorized') {
      Alert.alert(
        strings.label_error_modal_default_title,
        strings.label_allow_access_to_camera,
        [
          { text: strings.label_button_acknowledge,
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel' },
        ],
        { cancelable: false });
      return;
    }

    ImagePicker.openCamera({
      width: 500,
      height: 350,
      cropping: true,
      includeBase64: true,
    }).then(async (image) => {
      this.setImageData(image);
    });
  }

  setImageData = async (image) => {
    const thumbnailBase64 = await ImageService.getResizedImageBase64({
      uri: image.path,
      width: image.width,
      height: image.height,
    });
    this.setState({
      photos: [
        { uri: image.path, base64: image.data, thumbnail: { base64: thumbnailBase64 } },
      ],
    });
  }
  clearImageData = () => {
    this.setState({ photos: [] });
  }
  onAddLocationClick = () => {
    this.props.navigator.push({
      screen: ADD_LOCATION,
      title: strings.label_add_location,
      passProps: {
        onLocationSelected: this.onLocationSelected.bind(this),
      },
    });
  };

  onAddTrashPointsClick = () => {
    this.props.navigator.push({
      screen: ADD_TRASH_POINTS,
      passProps: {
        location: this.state.data.get('selectedLocation'),
        selectedTrashPoints: this.trashPoints,
        onTrashPointsSelected: this.onTrashPointsSelected.bind(this),
      },
    });
  };

  trashPoints = new Map();

  onTrashPointsSelected = (trashPoints) => {
    this.trashPoints = trashPoints;
    this.setData(d => d.set('trashPointsCount', this.trashPoints.size));
    const trashpointsList = [];
    this.trashPoints
      .forEach((item) => {
        trashpointsList.push(item.id);
      });

    this.setData(d => d.set('trashPoints', trashpointsList));
  }

  onLocationSelected(location) {
    this.setData(d => d.set('selectedLocation', location));

    this.validateLocation(location);
  }

  onTitleTextChanged = (text) => {
    this.title = text;
    this.setData(d => d.set('isTitleTextChanged', true));
  };

  onDescriptionTextChanged = (text) => {
    this.description = text;
    this.setData(d => d.set('isDescriptionTextChanged', true));
  };

  onWhatToBringTextChanged = (text) => {
    this.whatToBring = text;
    this.setData(d => d.set('isWhatToBringTextChanged', true));
  };

  validateTitle = (text) => {
    const isValid = (constants.TITLE_REGEX.test(text) && text[0] !== ' ');
    this.setData(d => d.set('isTitleValid', isValid));
    return isValid;
  };

  validateDescription = (text) => {
    const isValid = (constants.DESCRIPTION_REGEX.test(text) && text[0] !== ' ');
    this.setData(d => d.set('isDescriptionValid', isValid));
    return isValid;
  };

  validateWhatToBring = (text) => {
    const isValid = (constants.TITLE_REGEX.test(text) && text[0] !== ' ');
    this.setData(d => d.set('isWhatToBringValid', isValid));
    return isValid;
  };

  validateLocation = (selectedLocation) => {
    const isValid = selectedLocation !== undefined && selectedLocation !== null;
    this.setData(d => d.set('isLocationValid', isValid));
    this.setData(d => d.set('isLocationChanged', true));
    return isValid;
  };

  validateEndTime = (startTime, endTime) => {
    const endDateTime = Moment(endTime, 'DD-MM-YYYY HH:mm').toDate();
    const startDateTime = Moment(startTime, 'DD-MM-YYYY HH:mm').toDate();
    const isValid = startDateTime < endDateTime;
    this.setData(d => d.set('isEndDateValid', isValid));
  };

  onNextClick = (isValid) => {
    if (isValid) {
      const selectedLocation = this.state.data.get('selectedLocation');
      const location = {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      };
      const address = selectedLocation.place;
      const startTime = Moment(this.state.data
        .get('startDate'), 'DD-MM-YYYY HH:mm').toDate();
      const endTime = Moment(this.state.data
        .get('endDate'), 'DD-MM-YYYY HH:mm').toDate();
      this.props.navigator.push({
        screen: ADD_COORDINATOR,
        title: strings.label_create_events_step_two,
        passProps: {
          onEventAdded: this.props.onEventAdded,
          event: {
            name: this.title,
            address,
            startTime,
            endTime,
            location,
            description: this.description,
            whatToBring: this.whatToBring,
            photos: this.state.photos,
            trashpoints: this.state.data.get('trashPoints'),
          },
        },
      });
    } else {
      this.showValidationErrors();
    }
  };

  showValidationErrors = () => {
    const isTitleValid = this.state.data.get('isTitleValid');
    if (!isTitleValid) {
      this.setData(d => d.set('isTitleTextChanged', true));
    }
    const isDescriptionValid = this.state.data.get('isDescriptionValid');
    if (!isDescriptionValid) {
      this.setData(d => d.set('isDescriptionTextChanged', true));
    }
    const isWhatToBringValid = this.state.data.get('isWhatToBringValid');
    if (!isWhatToBringValid) {
      this.setData(d => d.set('isWhatToBringTextChanged', true));
    }
    const isLocationValid = this.state.data.get('isLocationValid');
    if (!isLocationValid) {
      this.validateLocation(this.state.data.get('selectedLocation'));
    }
    const isStartDateValid = this.state.data.get('isStartDateValid');
    const isEndDateValid = this.state.data.get('isEndDateValid');
    if (!isTitleValid || !isStartDateValid || !isEndDateValid || !isLocationValid) {
      this.refs.scrollView.scrollTo({ x: 0, y: 0, animated: true });
    }
  }
}
