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
                isNumberAttendeesValid: false
            })
        };
        this.event = props.event
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
        const { requestCreateEvent } = this.props;
        this.event['numberAttendees'] = this.numberAttendees;
        requestCreateEvent(this.event)
    }

}

AddPeopleToEvent.propTypes = {
    event: PropTypes.object,
    requestCreateEvent: PropTypes.func
};

export default AddPeopleToEvent
