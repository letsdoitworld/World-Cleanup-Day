import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import * as Immutable from 'immutable/dist/immutable';
import PropTypes from 'prop-types';

import ImmutableComponent from '../../../components/InputFields/ImmutableComponent';
import InputField from '../../../components/InputFields/InputField';
import MainButton from '../../../components/Buttons/MainButton';
import { AlertModal } from '../../../components/AlertModal';
import { EVENT_DETAILS_SCREEN } from '../../index';
import styles from './styles';
import { navigatorStyle } from './config';
import strings from '../../../assets/strings';
import { Icons, Badges } from '../../../assets/images';

const cancelId = 'cancelId';

class AddPeopleToEvent extends ImmutableComponent {
  static navigatorStyle = navigatorStyle;

  static navigatorButtons = {
    leftButtons: [
      {
        icon: Icons.Back,
        id: cancelId,
      },
    ],
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      data: Immutable.Map({
        isNumberAttendeesValid: false,
        isNumberAttendeesTextChanged: false,
        isNumberOfflineAttendeesValid: true,
        isNumberOfflineAttendeesTextChanged: false,
      }),
    };
    this.event = props.event;
    this.isAlertDialogVisible = false;
    props.requestCreateEventDone(null);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      switch (event.id) {
        case cancelId: {
          this.back();
          break;
        }
        default:
      }
    }
  }

  isProgressEnabled = () => {
    return this.props.loadingEvent;
  };

  renderProgress = () => {
    if (this.isProgressEnabled()) {
      return this.spinner();
    }
  };

  spinner() {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator
          style={styles.spinner}
          size="large"
          color="rgb(0, 143, 223)"
        />
      </View>
    );
  }

  back() {
    this.props.navigator.pop({
      animated: true,
      animationType: 'slide_out',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.createdEvent && !this.props.createdEvent) {
      this.openModal();
    }
  }

  componentDidUpdate() {
    const { errorEvent } = this.props;
    if (errorEvent !== null && errorEvent !== undefined) {
      throw new Error(errorEvent);
    }
  }

  componentDidMount() {
    if (!this.props.datasetUUIDSelector) {
      this.props.onFetchDatasetUUIDAction();
    }
  }

  componentWillUnmount() {
    const { requestCreateEventDone, requestCreateEventError } = this.props;
    requestCreateEventDone(null);
    requestCreateEventError(null);
  }

  renderNumberAttendeesTitle = () => {
    const isNumberAttendeesValid = this.state.data.get('isNumberAttendeesValid');
    const isNumberAttendeesTextChanged = this.state.data
      .get('isNumberAttendeesTextChanged');
    const style = (isNumberAttendeesValid && isNumberAttendeesTextChanged)
    || (!isNumberAttendeesValid && !isNumberAttendeesTextChanged)
      ? styles.titleTextStyle
      : styles.titleErrorTextStyle;
    return <View style={[styles.titleStyle, { paddingTop: 6 }]}>
      <Text style={style}>{strings.label_max_number_of_attendees.toUpperCase()}</Text>
    </View>;
  }
  renderNumberOfflineAttendeesTitle = () => {
    const isNumberOfflineAttendeesValid = this.state.data.get('isNumberAttendeesValid');
    const isNumberOfflineAttendeesTextChanged = this.state.data
      .get('isNumberAttendeesTextChanged');
    const style = (isNumberOfflineAttendeesValid && isNumberOfflineAttendeesTextChanged)
    || (!isNumberOfflineAttendeesValid && !isNumberOfflineAttendeesTextChanged)
      ? styles.titleTextStyle
      : styles.titleErrorTextStyle;
    return <View style={[styles.titleStyle, { paddingTop: 6 }]}>
      <Text style={style}>{strings.label_offline_attendees.toUpperCase()}</Text>
    </View>;
  }

  renderNumberAttendeesError = () => {
    const isNumberAttendeesValid = this.state.data.get('isNumberAttendeesValid');
    const isNumberAttendeesTextChanged = this.state.data
      .get('isNumberAttendeesTextChanged');
    if (!isNumberAttendeesValid && isNumberAttendeesTextChanged) {
      return <Text style={styles.textErrorStyle}>{strings.label_invalid_attendees}</Text>;
    }
    return null;
  }
  renderNumberOfflineAttendeesError = () => {
    const isNumberOfflineAttendeesValid
      = this.state.data.get('isNumberOfflineAttendeesValid');
    const isNumberOfflineAttendeesTextChanged = this.state.data
      .get('isNumberOfflineAttendeesTextChanged');
    if (!isNumberOfflineAttendeesValid && isNumberOfflineAttendeesTextChanged) {
      return <Text style={styles.textErrorStyle}>{strings.label_invalid_attendees}</Text>;
    }
    return null;
  }
  openModal = () => {
    this.setState({ showModal: true });
  };

  closeModal = () => {
    this.props.onEventAdded();
    this.props.requestCreateEventDone(null);
    this.setState({ showModal: false });
    this.props.navigator.dismissAllModals();
  };

  cancelButton = {
    text: strings.label_button_continue,
    onPress: this.closeModal,
  };
  inviteButton = {
    text: strings.label_invite,
    onPress: this.invite,
  };
  invite = () => {
    this.props.onEventAdded();
    this.props.navigator.dismissAllModals();
    setTimeout(() => {
      this.props.navigator.showModal({
        screen: EVENT_DETAILS_SCREEN,
        title: strings.label_event,
        passProps: {
          eventId: this.props.createdEvent.id,
        },
      });
    }, 2000);
  }
  render() {
    const isValidMax = this.state.data.get('isNumberAttendeesValid');
    const isValidOffline = this.state.data.get('isNumberOfflineAttendeesValid');
    const isValid = isValidMax && isValidOffline;
    return (
      <View style={styles.addCoordinatorContainer}>
        <AlertModal
          visible={this.state.showModal}
          title={strings.label_event_created}
          subtitle={strings.label_great_job}
          text={strings.label_event_created_text}
          image={Badges.onAddEvent}
          buttons={[this.cancelButton]}
          onOverlayPress={this.closeModal}
          onPress={this.closeModal}
        />
        <View>
          {this.renderNumberAttendeesTitle()}
          <View style={styles.inputContainerStyle}>
            <InputField
              style={styles.inputTextStyle}
              placeholder={strings.label_enter_digits_hint}
              autoCorrect={false}
              keyboardType="numeric"
              returnKeyType={'done'}
              validate={this.validateNumberAttendees}
              onChangeText={this.onNumberAttendeesTextChanged}
            />
          </View>
          {this.renderNumberAttendeesError()}
          {this.renderNumberOfflineAttendeesTitle()}
          <View style={styles.inputContainerStyle}>
            <InputField
              style={[styles.inputTextStyle, { paddingLeft: 6 }]}
              placeholder={strings.label_no_offline_attendees}
              autoCorrect={false}
              keyboardType="numeric"
              returnKeyType={'done'}
              validate={this.validateNumberOfflineAttendees}
              onChangeText={this.onNumberOfflineAttendeesTextChanged}
            />
          </View>
          {this.renderNumberOfflineAttendeesError()}
          <View style={[styles.titleStyle, { paddingTop: 6, paddingLeft: 16 }]}>
            <Text style={styles.textStyle}>{strings.label_invite_offline_attendees}</Text>
          </View>
        </View>
        <MainButton
          isValid={isValid}
          text={strings.label_create_event}
          style={styles.coordinatorNext}
          onPress={() => this.onCreateEventClick(isValid)}
        />
        {this.renderProgress()}
      </View>);
  }

  onNumberAttendeesTextChanged = (text) => {
    this.numberAttendees = text;
    this.validateNumberOfflineAttendees(!this.numberOfflineAttendees
      ? '' : this.numberOfflineAttendees);
    this.setData(d => d.set('isNumberAttendeesTextChanged', true));
  };
  onNumberOfflineAttendeesTextChanged = (text) => {
    this.numberOfflineAttendees = text;
    this.setData(d => d.set('isNumberOfflineAttendeesTextChanged', true));
  };

  validateNumberAttendees = (text) => {
    const isValid = text !== '' && text !== undefined && text !== null;
    this.setData(d => d.set('isNumberAttendeesValid', isValid));
    return isValid;
  };
  validateNumberOfflineAttendees = (text) => {
    const isValid = (text === '') || (text !== '' && text !== undefined && text !== null
      && parseInt(this.numberAttendees, 10) >= parseInt(text, 10));
    this.setData(d => d.set('isNumberOfflineAttendeesValid', isValid));
    return isValid;
  };

  onCreateEventClick = (isValid) => {
    if (isValid) {
      const { requestCreateEvent } = this.props;
      const event = { ...this.event,
        ...{ maxPeopleAmount: parseInt(this.numberAttendees, 10),
          offlineAttendeesAmount: (this.numberOfflineAttendees
            && this.numberOfflineAttendees !== '')
            ? parseInt(this.numberOfflineAttendees, 10) : 0,
          attendeesAmount: 0,
          datasetId: this.props.datasetUUIDSelector } };
      requestCreateEvent(event);
    } else {
      this.showValidationErrors();
    }
  };

  showValidationErrors = () => {
    this.setData(d => d.set('isNumberAttendeesTextChanged', true));
  }
}

AddPeopleToEvent.propTypes = {
  createdEvent: PropTypes.object,
  loadingEvent: PropTypes.bool,
  errorEvent: PropTypes.string,
  event: PropTypes.object.isRequired,
  datasetUUIDSelector: PropTypes.string,
  requestCreateEvent: PropTypes.func,
  requestCreateEventDone: PropTypes.func,
  requestCreateEventError: PropTypes.func,
  onFetchDatasetUUIDAction: PropTypes.func,
};

export default AddPeopleToEvent;
