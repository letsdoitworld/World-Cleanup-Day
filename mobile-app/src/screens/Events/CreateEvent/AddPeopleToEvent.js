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
import * as Immutable from "immutable/dist/immutable";
import constants from "../../../shared/constants";
import {ADD_COORDINATOR} from "../../index";

export default class AddPeopleToEvent extends ImmutableComponent {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarTitleTextCentered: true,
    };

    numberAttendees: string;

    constructor(props) {
        super(props);
        this.state = {
            data: Immutable.Map({
                isNumberAttendeesValid: false
            })
        }
    }

    render() {
        const isValid = this.state.data.get('isNumberAttendeesValid');
        return (
            <View style={styles.addCoordinatorContainer}>
                <View style={styles.titleStyle}>
                    <Text style={styles.titleTextStyle}>{strings.label_max_number_of_attendees.toUpperCase()}</Text>
                </View>
                <View style={styles.inputContainerStyle}>
                    <InputField style={styles.inputTextStyle}
                                placeholder={strings.label_enter_digits_hint}
                                autoCorrect={false}
                                keyboardType='numeric'
                                validate={this.validateNumberAttendees}
                                errorString={'Invalid phone'}
                                onChangeText={this.onNumberAttendeesTextChanged}/>
                </View>

                <MainButton
                    disabled={!isValid}
                    text={strings.label_next}
                    style={styles.coordinatorNext}
                    onPress={this.onCreateEventClick}/>
            </View>)
    }

    onNumberAttendeesTextChanged = (text: String) => {
        this.numberAttendees = text;
    };

    validateNumberAttendees = (text: String): boolean => {
        let isValid = text !== "" && text !== undefined && text !== null;
        this.setData(d => d.set('isNumberAttendeesValid', isValid));
        return isValid
    };

    onCreateEventClick = () => {
        
    }


}
