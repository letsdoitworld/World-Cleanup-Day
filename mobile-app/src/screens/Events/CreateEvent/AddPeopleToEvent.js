import React, {Component} from 'react';
import ImmutableComponent from "../../../components/InputFields/ImmutableComponent";
import {
    View, Text,
} from 'react-native';
import styles from "./styles";
import strings from "../../../assets/strings";
import InputField from '../../../components/InputFields/InputField';
import MainButton from '../../../components/Buttons/MainButton';
import * as Immutable from "immutable/dist/immutable";
import PropTypes from 'prop-types';
import {EVENTS, HOME_SCREEN} from "../../index";
import {Navigation} from "react-native-navigation";

class AddPeopleToEvent extends ImmutableComponent {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarTitleTextCentered: true,
    };

    numberAttendees: string;
    event: Object;

    constructor(props) {
        super(props);
        this.state = {
            data: Immutable.Map({
                isNumberAttendeesValid: false,
                isNumberAttendeesTextChanged: false,
            })
        };
        this.event = props.event
    }

    componentDidUpdate() {
        const {createEvent} = this.props;
        //console.warn("componentDidUpdate", createEvent)
        if (createEvent) {
            Navigation.dismissModal()
        }
    }

    renderNumberAttendeesTitle() {
        const isNumberAttendeesValid = this.state.data.get('isNumberAttendeesValid');
        const isNumberAttendeesTextChanged = this.state.data.get('isNumberAttendeesTextChanged');
        const style = (isNumberAttendeesValid && isNumberAttendeesTextChanged) || (!isNumberAttendeesValid && !isNumberAttendeesTextChanged) ? styles.titleTextStyle : styles.titleErrorTextStyle;
        return <View style={styles.titleStyle}>
            <Text style={style}>{strings.label_max_number_of_attendees.toUpperCase()}</Text>
        </View>
    }


    renderNumberAttendeesError() {
        const isNumberAttendeesValid = this.state.data.get('isNumberAttendeesValid');
        const isNumberAttendeesTextChanged = this.state.data.get('isNumberAttendeesTextChanged');
        if (!isNumberAttendeesValid && isNumberAttendeesTextChanged) {
            return <Text style={styles.textErrorStyle}>{strings.label_invalid_attendees}</Text>
        } else {
            return null
        }
    }

    render() {
        const isValid = this.state.data.get('isNumberAttendeesValid');
        return (
            <View style={styles.addCoordinatorContainer}>
                {this.renderNumberAttendeesTitle()}
                <View style={styles.inputContainerStyle}>
                    <InputField style={styles.inputTextStyle}
                                placeholder={strings.label_enter_digits_hint}
                                autoCorrect={false}
                                keyboardType='numeric'
                                validate={this.validateNumberAttendees}
                                errorString={'Invalid phone'}
                                onChangeText={this.onNumberAttendeesTextChanged}/>
                </View>
                {this.renderNumberAttendeesError()}
                <MainButton
                    isValid={isValid}
                    text={strings.label_next}
                    style={styles.coordinatorNext}
                    onPress={() => this.onCreateEventClick(isValid)}/>
            </View>)
    }

    onNumberAttendeesTextChanged = (text: String) => {
        this.numberAttendees = text;
        this.setData(d => d.set('isNumberAttendeesTextChanged', true));
    };

    validateNumberAttendees = (text: String): boolean => {
        let isValid = text !== "" && text !== undefined && text !== null;
        this.setData(d => d.set('isNumberAttendeesValid', isValid));
        return isValid
    };

    onCreateEventClick = (isValid) => {
        if (isValid) {
            const {requestCreateEvent} = this.props;
            //this.event['numberAttendees'] = this.numberAttendees;
            requestCreateEvent(this.event)
        } else {
            this.showValidationErrors()
        }
    };

    showValidationErrors() {
        this.setData(d => d.set('isNumberAttendeesTextChanged', true));
    }

}

AddPeopleToEvent.propTypes = {
    createEvent: PropTypes.object,
    requestCreateEvent: PropTypes.func
};

export default AddPeopleToEvent
