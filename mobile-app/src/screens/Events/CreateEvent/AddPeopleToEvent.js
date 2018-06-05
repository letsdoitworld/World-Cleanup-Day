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
      }),
    };
    this.event = props.event;
    this.isAlertDialogVisible = false;
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
    return this.props.isLoading;
  }

  renderProgress = () => {
    if (this.isProgressEnabled()) {
      return this.spinner();
    }
  }

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
    requestCreateEventDone(undefined);
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

  renderNumberAttendeesError = () => {
    const isNumberAttendeesValid = this.state.data.get('isNumberAttendeesValid');
    const isNumberAttendeesTextChanged = this.state.data
      .get('isNumberAttendeesTextChanged');
    if (!isNumberAttendeesValid && isNumberAttendeesTextChanged) {
      return <Text style={styles.textErrorStyle}>{strings.label_invalid_attendees}</Text>;
    }
    return null;
  }
  openModal = () => {
    this.setState({ showModal: true });
  }
  switchTabIndex = () => {
    this.props.navigator.switchToTab({
      tabIndex: 2,
    });
  };
  closeModal = () => {
    this.setState({ showModal: false });
    this.props.onEventAdded();
    this.props.navigator.dismissAllModals();
    this.switchTabIndex();
  }
  cancelButton = {
    text: strings.label_skip,
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
    const isValid = this.state.data.get('isNumberAttendeesValid');
    return (
      <View style={styles.addCoordinatorContainer}>
        <AlertModal
          visible={this.state.showModal}
          title={strings.label_event_created}
          subtitle={strings.label_great_job}
          text={strings.label_event_created_text}
          image={Badges.onAddEvent}
          buttons={[this.cancelButton, this.inviteButton]}
          onOverlayPress={this.closeModal}
          onPress={this.closeModal}
        />
        <View>
          {this.renderNumberAttendeesTitle()}
          <View style={styles.inputContainerStyle}>
            <InputField
              style={[styles.inputTextStyle, { paddingLeft: 6 }]}
              placeholder={strings.label_enter_digits_hint}
              autoCorrect={false}
              keyboardType="numeric"
              returnKeyType={'done'}
              validate={this.validateNumberAttendees}
              onChangeText={this.onNumberAttendeesTextChanged}
            />
          </View>
          {this.renderNumberAttendeesError()}
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
    this.setData(d => d.set('isNumberAttendeesTextChanged', true));
  };

  validateNumberAttendees = (text) => {
    const isValid = text !== '' && text !== undefined && text !== null;
    this.setData(d => d.set('isNumberAttendeesValid', isValid));
    return isValid;
  };

  onCreateEventClick = (isValid) => {
    if (isValid) {
      const { requestCreateEvent } = this.props;
      const event = { ...this.event,
        ...{ maxPeopleAmount: parseInt(this.numberAttendees, 10),
          datasetId: this.props.datasetUUIDSelector } };
      requestCreateEvent(event);
      this.openModal();
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
  errorEvent: PropTypes.string,
  event: PropTypes.object.isRequired,
  isLoading: PropTypes.bool,
  datasetUUIDSelector: PropTypes.string,
  requestCreateEvent: PropTypes.func,
  requestCreateEventDone: PropTypes.func,
  requestCreateEventError: PropTypes.func,
  onFetchDatasetUUIDAction: PropTypes.func,
};

export default AddPeopleToEvent;
