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
import {ADD_COORDINATOR} from "../../index";

export default class AddCoordinator extends ImmutableComponent {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarTitleTextCentered: true,
    };

    userName: string;
    phoneNumber: string;
    email: string;

    constructor(props) {
        super(props);
        this.state = {
            data: Immutable.Map({
                isUserNameValid: false,
                isPhoneNumberValid: false,
                isEmailValid: false,
            })
        }
    }

    render() {
        const isUserNameValid = this.state.data.get('isUserNameValid');
        const isPhoneNumberValid = this.state.data.get('isPhoneNumberValid');
        const isEmailValid = this.state.data.get('isEmailValid');

        const isValid = isUserNameValid && isPhoneNumberValid && isEmailValid;

        return (
            <View style={styles.addCoordinatorContainer}>
                <View style={styles.titleStyle}>
                    <Text style={styles.titleTextStyle}>{strings.label_coordinator.toUpperCase()}</Text>
                </View>
                <View style={styles.inputContainerStyle}>
                    <InputField style={styles.inputTextStyle}
                                placeholder={strings.label_coordinator_hint}
                                autoCorrect={false}
                                validate={this.validateUserName}
                                onChangeText={this.onUserNameTextChanged}/>
                </View>
                <View style={styles.titleStyle}>
                    <Text style={styles.titleTextStyle}>{strings.label_contact_details.toUpperCase()}</Text>
                </View>
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
                <View style={styles.locationContainerStyle}>
                    <Image source={require('../../../assets/images/ic_email.png')}
                           style={styles.imageTrashStyle}/>
                    <InputField style={styles.inputUserDataStyle}
                                placeholder={strings.label_email}
                                autoCorrect={false}
                                validate={this.validateEmail}
                                errorString={'Invalid email'}
                                onChangeText={this.onEmailTextChanged}/>
                </View>
                <MainButton
                    disabled={!isValid}
                    text={strings.label_next}
                    style={styles.coordinatorNext}
                    onPress={this.onNextClick.bind(this)}/>
            </View>)
    }

    onUserNameTextChanged = (text: String) => {
        this.userName = text;
    };

    onPhoneNumberTextChanged = (text: String) => {
        this.phoneNumber = text;
    };

    onEmailTextChanged = (text: String) => {
        this.email = text;
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

    onNextClick = () => {
        this.props.navigator.push({
            screen: ADD_COORDINATOR,
            title: strings.label_create_events_step_two,
            passProps: {
                event: {
                    name: this.props.event.title,
                    startDate: this.props.event.startDate,
                    endDate: this.props.event.endDate,
                    // location: {
                    //     latitude: 48.8152937,
                    //     longitude: 2.4597668,
                    // }
                    description: this.props.event.description,
                    whatToBring: this.props.event.whatToBring,
                    imageUrl: this.props.event.imageUrl,
                    coordinatorName: this.userName,
                    phoneNumber: this.phoneNumber,
                    email: this.email,
                },
            }
        });
    }

}