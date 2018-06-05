import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { Image, Platform, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import ImmutableComponent from '../../../components/InputFields/ImmutableComponent';
import styles from './styles';
import strings from '../../../assets/strings';
import InputField from '../../../components/InputFields/InputField';
import MainButton from '../../../components/Buttons/MainButton';
import constants from '../../../shared/constants';
import * as Immutable from '../../../../node_modules/immutable/dist/immutable';
import { ADD_PEOPLE_TO_EVENT } from '../../index';
import { navigatorStyle } from './config';
import { Icons } from '../../../assets/images';


const cancelId = 'cancelId';

export default class AddCoordinator extends ImmutableComponent {
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
      data: Immutable.Map({
        isUserNameValid: true,
        isUserNameTextChanged: false,
        isPhoneNumberValid: false,
        isPhoneNumberTextChanged: false,
        isEmailValid: true,
        isEmailTextChanged: false,
        height: 0,
      }),
    };
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

    updateSize = (height) => {
      this.setState({
        height,
      });
    };

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

    back = () => {
      this.props.navigator.pop({
        animated: true,
        animationType: 'slide_out',
      });
    }

    renderUserNameTitle = () => {
      const isUserNameValid = this.state.data.get('isUserNameValid');
      const isUserNameTextChanged = this.state.data.get('isUserNameTextChanged');
      const style = (isUserNameValid && isUserNameTextChanged)
        || (!isUserNameValid && !isUserNameTextChanged
        || (isUserNameValid && !isUserNameTextChanged))
        ? styles.titleTextStyle
        : styles.titleErrorTextStyle;
      return <View style={styles.titleStyle}>
        <Text style={style}>{strings.label_coordinator.toUpperCase()}</Text>
      </View>;
    }

    renderPhoneNumberTitle = () => {
      const isPhoneNumberValid = this.state.data.get('isPhoneNumberValid');
      const isPhoneNumberTextChanged = this.state.data.get('isPhoneNumberTextChanged');
      const isEmailValid = this.state.data.get('isEmailValid');
      const isEmailTextChanged = this.state.data.get('isEmailTextChanged');
      const style = (isPhoneNumberValid && isPhoneNumberTextChanged
        && isEmailValid && isEmailTextChanged)
        || (!isPhoneNumberValid && !isPhoneNumberTextChanged &&
            !isEmailValid && !isEmailTextChanged)
        || (!isPhoneNumberValid && !isPhoneNumberTextChanged
            && isEmailValid && !isEmailTextChanged)
        || (isPhoneNumberValid && isPhoneNumberTextChanged
            && isEmailValid && !isEmailTextChanged)
        ? styles.titleTextStyle
        : styles.titleErrorTextStyle;
      return <View style={styles.titleStyle}>
        <Text style={style}>{strings.label_contact_details.toUpperCase()}</Text>
      </View>;
    }

    renderUserNameError = () => {
      const isUserNameValid = this.state.data.get('isUserNameValid');
      const isUserNameTextChanged = this.state.data.get('isUserNameTextChanged');
      if (!isUserNameValid && isUserNameTextChanged) {
        return <Text style={styles.textErrorStyle}>
          {strings.label_invalid_coordinator_field}
        </Text>;
      }
      return null;
    }

    renderPhoneNumberError = () => {
      const isPhoneNumberValid = this.state.data.get('isPhoneNumberValid');
      const isPhoneNumberTextChanged = this.state.data.get('isPhoneNumberTextChanged');
      if (!isPhoneNumberValid && isPhoneNumberTextChanged) {
        return <Text style={styles.textErrorStyle}>
          {strings.label_invalid_phone_number}
        </Text>;
      }
      return null;
    }

    renderEmailError = () => {
      const isEmailValid = this.state.data.get('isEmailValid');
      const isEmailTextChanged = this.state.data.get('isEmailTextChanged');
      if (!isEmailValid && isEmailTextChanged) {
        return <Text style={styles.textErrorStyle}>
          {strings.label_invalid_email}
        </Text>;
      }
      return null;
    }

    render = () => {
      const isUserNameValid = this.state.data.get('isUserNameValid');
      const isPhoneNumberValid = this.state.data.get('isPhoneNumberValid');
      const isEmailValid = this.state.data.get('isEmailValid');

      const isValid = isUserNameValid && isPhoneNumberValid && isEmailValid;
      const { height } = this.state;
      const newStyle = {
        height,
      };
      return (
        <View style={styles.addCoordinatorContainer}>
          <View>
            {this.renderUserNameTitle()}
            <View style={Platform.OS === 'android'
              ? [styles.inputContainerStyle, newStyle]
              : styles.inputContainerStyle}
            >
              <InputField
                style={styles.inputTextStyle}
                placeholder={strings.label_coordinator_hint}
                autoCorrect={false}
                validate={this.validateUserName}
                multiline
                maxLength={70}
                onChangeText={this.onUserNameTextChanged}
                onContentSizeChange={e =>
                  this.updateSize(e.nativeEvent.contentSize.height)}
              />
              <Image source={Icons.Edit} style={styles.editImageTrashStyle} />
            </View>
            {this.renderUserNameError()}
            {this.renderPhoneNumberTitle()}
            <View style={styles.locationContainerStyle}>
              <Image
                source={require('../../../assets/images/ic_phone_number.png')}
                style={styles.imageTrashStyle}
              />
              <InputField
                style={styles.inputUserDataStyle}
                placeholder={strings.label_phone_number}
                autoCorrect={false}
                keyboardType="phone-pad"
                validate={this.validatePhoneNumber}
                errorString={'Invalid phone'}
                onChangeText={this.onPhoneNumberTextChanged}
              />
            </View>
            {this.renderPhoneNumberError()}
            <View style={styles.locationContainerStyle}>
              <Image
                source={require('../../../assets/images/ic_email.png')}
                style={styles.imageTrashStyle}
              />
              <InputField
                style={styles.inputUserDataStyle}
                placeholder={strings.label_email}
                autoCorrect={false}
                validate={this.validateEmail}
                errorString={'Invalid email'}
                autoCapitalize="none"
                onChangeText={this.onEmailTextChanged}
              />
            </View>
            {this.renderEmailError()}
          </View>
          <MainButton
            isValid={isValid}
            text={strings.label_next}
            style={styles.coordinatorNext}
            onPress={() => this.onNextClick(isValid)}
          />
        </View>);
    }

  onUserNameTextChanged = (text) => {
    this.userName = text;
    this.setData(d => d.set('isUserNameTextChanged', true));
  };

  onPhoneNumberTextChanged = (text) => {
    this.phoneNumber = text;
    this.setData(d => d.set('isPhoneNumberTextChanged', true));
  };

  onEmailTextChanged = (text) => {
    this.email = text;
    this.setData(d => d.set('isEmailTextChanged', true));
  };

  validateUserName = (text) => {
    let isValid;
    if (isEmpty(text)) {
      isValid = true;
    } else {
      isValid = constants.COORDINATOR_REGEX.test(text);
    }
    this.setData(d => d.set('isUserNameValid', isValid));
    return isValid;
  };

  validatePhoneNumber = (text) => {
    const isValid = constants.PHONE_NUMBER.test(text);
    this.setData(d => d.set('isPhoneNumberValid', isValid));
    return isValid;
  };

  validateEmail = (text) => {
    let isValid;
    if (isEmpty(text)) {
      isValid = true;
    } else {
      isValid = constants.EMAIL_REGEX.test(text);
    }
    this.setData(d => d.set('isEmailValid', isValid));
    return isValid;
  };

  onNextClick = (isValid) => {
    if (!isValid) {
      this.showValidationErrors();
    } else {
      this.props.navigator.push({
        screen: ADD_PEOPLE_TO_EVENT,
        title: strings.label_create_events_step_three,
        passProps: {
          onEventAdded: this.props.onEventAdded,
          event: {
            name: this.props.event.name,
            address: this.props.event.address,
            startTime: this.props.event.startTime,
            endTime: this.props.event.endTime,
            location: this.props.event.location,
            description: this.props.event.description,
            whatToBring: this.props.event.whatToBring,
            photos: this.props.event.photos,
            coordinatorName: this.userName,
            phonenumber: this.phoneNumber,
            email: this.email,
            trashpoints: this.props.event.trashpoints,
          },
        },
      });
    }
  };

  showValidationErrors = () => {
    const isUserNameValid = this.state.data.get('isUserNameValid');
    if (!isUserNameValid) {
      this.setData(d => d.set('isUserNameTextChanged', true));
    }
    const isPhoneNumberValid = this.state.data.get('isPhoneNumberValid');
    if (!isPhoneNumberValid) {
      this.setData(d => d.set('isPhoneNumberTextChanged', true));
    }
    const isEmailValid = this.state.data.get('isEmailValid');
    if (!isEmailValid) {
      this.setData(d => d.set('isEmailTextChanged', true));
    }
  }
}

AddCoordinator.propTypes = {
  event: PropTypes.object.isRequired,
};
