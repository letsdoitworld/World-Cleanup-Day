import React, {Component} from 'react';
import ImmutableComponent from "../../../components/InputFields/ImmutableComponent";
import {
    View, TouchableOpacity, Text, ScrollView,
    TextInput, Image, TouchableHighlight
} from 'react-native';
import styles from "./styles";
import strings from "../../../assets/strings";
import InputField from '../../../components/InputFields/InputField';
import MainButton from '../../../components/Buttons/MainButton';
import constants from "../../../shared/constants";
import * as Immutable from "../../../../node_modules/immutable/dist/immutable";
import {ADD_COORDINATOR, ADD_PEOPLE_TO_EVENT} from "../../index";

const cancelId = 'cancelId';

export default class AddCoordinator extends ImmutableComponent {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarTitleTextCentered: true,
    };

    static navigatorButtons = {
        leftButtons: [
            {
                icon: require('../../../../src/assets/images/ic_back.png'),
                id: cancelId,
            }
        ],
    };

    userName: string;
    phoneNumber: string;
    email: string;

    constructor(props) {
        super(props);
        this.state = {
            data: Immutable.Map({
                isUserNameValid: false,
                isUserNameTextChanged: false,
                isPhoneNumberValid: false,
                isPhoneNumberTextChanged: false,
                isEmailValid: false,
                isEmailTextChanged: false,
            })
        };
    }

    renderUserNameTitle() {
        const isUserNameValid = this.state.data.get('isUserNameValid');
        const isUserNameTextChanged = this.state.data.get('isUserNameTextChanged');
        const style = (isUserNameValid && isUserNameTextChanged) || (!isUserNameValid && !isUserNameTextChanged) ? styles.titleTextStyle : styles.titleErrorTextStyle;
        return  <View style={styles.titleStyle}>
            <Text style={style}>{strings.label_coordinator.toUpperCase()}</Text>
        </View>
    }

    renderPhoneNumberTitle() {
        const isPhoneNumberValid = this.state.data.get('isPhoneNumberValid');
        const isPhoneNumberTextChanged = this.state.data.get('isPhoneNumberTextChanged');
        const isEmailValid = this.state.data.get('isEmailValid');
        const isEmailTextChanged = this.state.data.get('isEmailTextChanged');
        const style = (isPhoneNumberValid && isPhoneNumberTextChanged && isEmailValid && isEmailTextChanged)
        || (!isPhoneNumberValid && !isPhoneNumberTextChanged && !isEmailValid && !isEmailTextChanged) ? styles.titleTextStyle : styles.titleErrorTextStyle;
        return  <View style={styles.titleStyle}>
            <Text style={style}>{strings.label_contact_details.toUpperCase()}</Text>
        </View>
    }

    renderUserNameError() {
        const isUserNameValid = this.state.data.get('isUserNameValid');
        const isUserNameTextChanged = this.state.data.get('isUserNameTextChanged');
        if (!isUserNameValid && isUserNameTextChanged) {
            return <Text style={styles.textErrorStyle}>{strings.label_invalid_event_field}</Text>
        } else {
            return null
        }
    }

    renderPhoneNumberError() {
        const isPhoneNumberValid = this.state.data.get('isPhoneNumberValid');
        const isPhoneNumberTextChanged = this.state.data.get('isPhoneNumberTextChanged');
        if (!isPhoneNumberValid && isPhoneNumberTextChanged) {
            return <Text style={styles.textErrorStyle}>{strings.label_invalid_phone_number}</Text>
        } else {
            return null
        }
    }

    renderEmailError() {
        const isEmailValid = this.state.data.get('isEmailValid');
        const isEmailTextChanged = this.state.data.get('isEmailTextChanged');
        if (!isEmailValid && isEmailTextChanged) {
            return <Text style={styles.textErrorStyle}>{strings.label_invalid_email}</Text>
        } else {
            return null
        }
    }

    render() {
        const isUserNameValid = this.state.data.get('isUserNameValid');
        const isPhoneNumberValid = this.state.data.get('isPhoneNumberValid');
        const isEmailValid = this.state.data.get('isEmailValid');

        const isValid = isUserNameValid && isPhoneNumberValid && isEmailValid;

        return (
            <View style={styles.addCoordinatorContainer}>
                {this.renderUserNameTitle()}
                <View style={styles.inputContainerStyle}>
                    <InputField style={styles.inputTextStyle}
                                placeholder={strings.label_coordinator_hint}
                                autoCorrect={false}
                                validate={this.validateUserName}
                                onChangeText={this.onUserNameTextChanged}/>
                </View>
                {this.renderUserNameError()}
                {this.renderPhoneNumberTitle()}
                <View style={styles.locationContainerStyle}>
                    <Image source={require('../../../assets/images/ic_phone_number.png')}
                           style={styles.imageTrashStyle}/>
                    <InputField style={styles.inputUserDataStyle}
                                placeholder={strings.label_phone_number}
                                autoCorrect={false}
                                keyboardType='phone-pad'
                                validate={this.validatePhoneNumber}
                                errorString={'Invalid phone'}
                                onChangeText={this.onPhoneNumberTextChanged}/>
                </View>
                {this.renderPhoneNumberError()}
                <View style={styles.locationContainerStyle}>
                    <Image source={require('../../../assets/images/ic_email.png')}
                           style={styles.imageTrashStyle}/>
                    <InputField style={styles.inputUserDataStyle}
                                placeholder={strings.label_email}
                                autoCorrect={false}
                                validate={this.validateEmail}
                                errorString={'Invalid email'}
                                autoCapitalize='none'
                                onChangeText={this.onEmailTextChanged}/>
                </View>
                {this.renderEmailError()}
                <MainButton
                    isValid={isValid}
                    text={strings.label_next}
                    style={styles.coordinatorNext}
                    onPress={() => this.onNextClick(isValid)}/>
            </View>)
    }

    onUserNameTextChanged = (text: String) => {
        this.userName = text;
        this.setData(d => d.set('isUserNameTextChanged', true));
    };

    onPhoneNumberTextChanged = (text: String) => {
        this.phoneNumber = text;
        this.setData(d => d.set('isPhoneNumberTextChanged', true));
    };

    onEmailTextChanged = (text: String) => {
        this.email = text;
        this.setData(d => d.set('isEmailTextChanged', true));
    };

    validateUserName = (text: String): boolean => {
        let isValid = constants.TITLE_REGEX.test(text);
        this.setData(d => d.set('isUserNameValid', isValid));
        return isValid
    };

    validatePhoneNumber = (text: String): boolean => {
        let isValid = constants.PHONE_NUMBER.test(text);
        this.setData(d => d.set('isPhoneNumberValid', isValid));
        return isValid
    };

    validateEmail = (text: String): boolean => {
        let isValid = constants.EMAIL_REGEX.test(text);
        this.setData(d => d.set('isEmailValid', isValid));
        return isValid
    };

    onNextClick = (isValid) => {
        if (!isValid) {
            this.showValidationErrors()
        } else {
            this.props.navigator.push({
                screen: ADD_PEOPLE_TO_EVENT,
                title: strings.label_create_events_step_three,
                passProps: {
                    event: {
                        datasetId: this.props.event.datasetId,
                        name: this.props.event.name,
                        address: '456',
                        startTime: this.props.event.startDate,
                        endTime: this.props.event.endDate,
                        location: {
                            latitude: 48.8152937,
                            longitude: 2.4597668,
                        },
                        description: this.props.event.description,
                        whatToBring: this.props.event.whatToBring,
                        // imageUrl: this.props.event.imageUrl,
                        // coordinatorName: this.userName,
                        // phoneNumber: this.phoneNumber,
                        email: this.email,
                    },
                }
            });
        }
    };

    showValidationErrors() {
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