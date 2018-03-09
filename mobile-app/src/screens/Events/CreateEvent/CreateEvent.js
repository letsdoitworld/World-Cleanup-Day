import React, {Component} from 'react';
import {
    View, TouchableOpacity, Text, ScrollView,
    TextInput, Image, TouchableHighlight, Alert
} from 'react-native';
import styles from './styles'
import strings from '../../../assets/strings'
import MainButton from '../../../components/Buttons/MainButton'
import InputField from '../../../components/InputFields/InputField'
import constants from "../../../shared/constants";
import * as Immutable from "../../../../node_modules/immutable/dist/immutable";

import {ADD_TRASH_POINTS, ADD_COORDINATOR, ADD_LOCATION, CREATE_EVENT} from "../../index";
import ImmutableComponent from "../../../components/InputFields/ImmutableComponent";
import ImagePicker from 'react-native-image-crop-picker';
import DatePicker from 'react-native-datepicker';
import Moment from 'moment';

export default class CreateEvent extends ImmutableComponent {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarTitleTextCentered: true,
    };

    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    whatToBring: string;

    constructor(props) {
        super(props);
        this.title = "";
        this.description = "";
        this.whatToBring = "";
        this.state = {
            data: Immutable.Map({
                isTitleValid: false,
                isDescriptionValid: false,
                isWhatToBringValid: false,
                isStartDateValid: true,
                isEndDateValid: true,
                isDateTimePickerVisible: false,
                imageUrl: '',
                startDate: this.calculateMinDate(),
                endDate: this.calculateMinDate(),
            })
        }
    }

    calculateMinDate() {
        const date = new Date();
        return Moment(date).format("DD-MM-YYYY HH:mm");
    };

    renderStartPicker() {
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
            customStyles={{dateInput: {borderWidth: 0}}}
            onDateChange={(date) => {
                const endDate = this.state.data.get('endDate');
                this.validateEndTime();
                this.setData(d => d.set('startDate', date));
                const changedEndDate = date.split(" ")[0] + " " + endDate.split(" ")[1];
                this.setData(d => d.set('endDate', changedEndDate))
            }}/>
    }

    renderTitle() {
        const isTitleValid = this.state.data.get('isTitleValid');
        const style = (isTitleValid) ? styles.titleTextStyle : styles.titleErrorTextStyle;
        return <View style={styles.titleStyle}>
            <Text style={styles.titleErrorTextStyle}>{strings.label_title.toUpperCase()}</Text>
        </View>
    }

    renderEndPicker() {
        const endDate = this.state.data.get('endDate');
        const minDate = this.calculateMinDate();
        return <DatePicker
            style={styles.datePickerContainer}
            mode="time"
            date={endDate}
            format="DD-MM-YYYY HH:mm"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            minDate={minDate}
            maxDate="01-01-2060"
            customStyles={{dateInput: {borderWidth: 0}}}
            onDateChange={(date) => {
                this.validateEndTime(date);
                console.warn("Date ", date);
                const startDate = this.state.data.get('startDate');
                const endDate = startDate.split(" ")[0] + " " + date;
                this.setData(d => d.set('endDate', endDate))
            }}/>
    }

    render() {
        const isTitleValid = this.state.data.get('isTitleValid');
        const isDescriptionValid = this.state.data.get('isDescriptionValid');
        const isWhatToBringValid = this.state.data.get('isWhatToBringValid');
        const isStartDateValid = this.state.data.get('isStartDateValid');
        const isEndDateValid = this.state.data.get('isEndDateValid');
        const imagePath = this.state.data.get('imageUrl');

        //const isValid = isTitleValid && isDescriptionValid && isWhatToBringValid && isStartDateValid && isEndDateValid;
        const isValid = isTitleValid;
        //const isValid = isStartDateValid && isEndDateValid;

        return (
            <View>
                <ScrollView style={styles.container}>

                    <View style={styles.titleStyle}>
                        <Text style={styles.titleErrorTextStyle}>{strings.label_title.toUpperCase()}</Text>
                    </View>
                    <View style={styles.inputContainerStyle}>
                        <InputField style={styles.inputTextStyle}
                                    placeholder={strings.label_title_hint}
                                    autoCorrect={false}
                                    validate={this.validateTitle}
                                    onChangeText={this.onTitleTextChanged}/>
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_date_and_time.toUpperCase()}</Text>
                    </View>
                    <View style={styles.dateContainer}>
                        <View style={styles.imageContainer}>
                            <Image source={require('../images/ic_time.png')}
                                   style={styles.imageItemStyle}/>
                        </View>
                        <View style={styles.dateAndTimeContainerStyle}>
                            <View style={styles.dateAndTimeRowStyle}>
                                <Text style={styles.dateTitleTextStyle}>{strings.label_start}</Text>
                                {this.renderStartPicker()}
                            </View>
                            <View style={styles.dividerStyle}/>
                            <View style={styles.dateAndTimeRowStyle}>
                                <Text style={styles.dateTitleTextStyle}>{strings.label_end}</Text>
                                {this.renderEndPicker()}
                            </View>
                        </View>
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_location.toUpperCase()}</Text>
                    </View>
                    <TouchableOpacity onPress={this.onAddLocationClick.bind(this)}>
                        <View style={styles.locationContainerStyle}>
                            <Image source={require('../../../../src/assets/images/ic_location.png')}
                                   style={styles.imageTrashStyle}/>
                            <Text style={styles.textTrashStyle}>{strings.label_add_location}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_trashpoints.toUpperCase()}</Text>
                    </View>
                    <TouchableOpacity onPress={this.onAddTrashPointsClick.bind(this)}>
                        <View style={styles.trashpointTipStyle}>
                            <Image source={require('../images/ic_trashpoints.png')}
                                   style={styles.imageTrashStyle}/>
                            <Text style={styles.textTrashStyle}>{strings.label_tip_add_trashpoints}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_description.toUpperCase()}</Text>
                    </View>
                    <View style={styles.descriptionContainerStyle}>
                        <InputField style={styles.inputTextStyle}
                                    placeholder={strings.label_ignite_people_to_participate}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    multiline={true}
                                    validate={this.validateDescription}
                                    onChangeText={this.onDescriptionTextChanged}/>
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_what_to_bring_with_you.toUpperCase()}</Text>
                    </View>
                    <View style={styles.whatBringContainerStyle}>
                        <InputField style={styles.inputTextStyle}
                                    placeholder={strings.label_specify_tools_for_work}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    multiline={true}
                                    validate={this.validateWhatToBring}
                                    onChangeText={this.onWhatToBringTextChanged}/>
                    </View>
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_cover_photo.toUpperCase()}</Text>
                    </View>
                    <View style={styles.eventPhotoContainerStyle}>
                        <Image style={styles.photoIconStyle} source={{uri: imagePath}}/>
                        <TouchableOpacity onPress={() => this.showChoosedDialog()}>
                            <Image style={styles.addPhotoIconStyle}
                                   source={require('../images/ic_add_photo.png')}/>
                        </TouchableOpacity>
                        <Text style={styles.addPhotoTextStyle}>{strings.label_add_photo}</Text>
                    </View>

                    <MainButton
                        disabled={!isValid}
                        text={strings.label_next}
                        style={styles.nextButtonStyle}
                        onPress={this.onNextClick.bind(this)}/>
                </ScrollView>
            </View>
        )
    }

    showChoosedDialog() {
        Alert.alert(
            'Add photo',
            'Add photo to event!',
            [
                {text: 'Cancel', onPress: () => console.log('OK Pressed'), style: 'cancel'},
                {text: 'Take photo', onPress: () => this.openCamera()},
                {text: 'From Gallery', onPress: () => this.openGallery()},
            ],
            {cancelable: true}
        )
    };

    openGallery() {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            this.setData(d => d.set('imageUrl', image.path))
        });
    };

    openCamera() {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            this.setData(d => d.set('imageUrl', image.path))
        });
    }

    onAddLocationClick = () => {
        this.props.navigator.push({
            screen: ADD_LOCATION,
            title: strings.label_add_location,
            passProps: {
                //todo: pass some location. By default map will be positioned to current user's location
                // initialLocation: {
                //     latitude: 48.8152937,
                //     longitude: 2.4597668,
                // },
                onLocationSelected: this.onLocationSelected.bind(this),
            }
        });
    };

    onAddTrashPointsClick = () => {
        this.props.navigator.push({
            screen: ADD_TRASH_POINTS,
            title: strings.label_add_trashPoints,
            passProps: {
                //todo: pass some location for search order
                location: {
                    latitude: 48.8152937,
                    longitude: 2.4597668,
                },
                selectedTrashPoints: this.trashPoints,
                onTrashPointsSelected: this.onTrashPointsSelected.bind(this),
            }
        });
    };

    trashPoints = new Map();

    onTrashPointsSelected(trashPoints) {
        console.log(trashPoints);
        console.log("onTrashPointsSelected");
        this.trashPoints = trashPoints;
    }

    onLocationSelected(location) {
        console.log(location)
    }

    onTitleTextChanged = (text: String) => {
        this.title = text;
    };

    onDescriptionTextChanged = (text: String) => {
        this.description = text;
    };

    onWhatToBringTextChanged = (text: String) => {
        this.whatToBring = text;
    };

    validateTitle = (text: String): boolean => {
        let isValid = constants.TITLE_REGEX.test(text);
        this.setData(d => d.set('isTitleValid', isValid));
        return isValid
    };

    validateDescription = (text: String): boolean => {
        let isValid = constants.DESCRIPTION_REGEX.test(text);
        this.setData(d => d.set('isDescriptionValid', isValid));
        return isValid
    };

    validateWhatToBring = (text: String): boolean => {
        let isValid = constants.DESCRIPTION_REGEX.test(text);
        this.setData(d => d.set('isWhatToBringValid', isValid));
        return isValid
    };

    validateEndTime = (endTime: String) => {
        const endDateTime = Moment(endTime, "HH:mm").toDate();
        const startDateFormat = this.state.data.get('startDate');
        const startDate = Moment(startDateFormat, "DD-MM-YYYY HH:mm").toDate();
        let endDateAndTime = Moment(startDateFormat, "DD-MM-YYYY HH:mm").toDate();
        endDateAndTime.setHours(endDateTime.getHours(), endDateAndTime.getMinutes());
        let isValid = startDate < endDateAndTime;
        this.setData(d => d.set('isEndDateValid', isValid))
    };

    onNextClick = () => {
        this.props.navigator.push({
            screen: ADD_COORDINATOR,
            title: strings.label_create_events_step_two,
            passProps: {
                event: {
                    name: this.title,
                    startDate: this.state.data.get('startDate'),
                    endDate: this.state.data.get('endDate'),
                    // location: {
                    //     latitude: 48.8152937,
                    //     longitude: 2.4597668,
                    // }
                    description: this.description,
                    whatToBring: this.whatToBring,
                    imageUrl: this.state.data.get('imageUrl'),
                },
            }
        });
    }
}