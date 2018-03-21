import React, {Component} from 'react';
import {
    View, TouchableOpacity, Text, ScrollView, Image, Alert, ImageStore
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
import {Navigation} from "react-native-navigation";

import { Icons } from '../../../assets/images';
import ImageService from "../../../services/Image";

const cancelId = 'cancelId';

export default class CreateEvent extends ImmutableComponent {

    static navigatorStyle = {
        tabBarHidden: true,
        navBarTitleTextCentered: true,
    };

    static navigatorButtons = {
        leftButtons: [
            {
                icon: Icons.Close,
                id: cancelId,
            }
        ],
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
                isTitleTextChanged: false,
                isDescriptionValid: false,
                isDescriptionTextChanged: false,
                isWhatToBringValid: false,
                isWhatToBringTextChanged: false,
                isStartDateValid: true,
                isEndDateValid: true,
                isDateTimePickerVisible: false,
                photos: [],
                startDate: this.calculateMinDate(),
                endDate: this.calculateMinDate(),
                selectedLocation: undefined
            })
        };
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        if (event.type === 'NavBarButtonPress') {
            switch (event.id) {
                case cancelId: {
                    this.back();
                    break;
                }
            }
        }
    }

    back() {
        Navigation.dismissModal()
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
        const isTitleTextChanged = this.state.data.get('isTitleTextChanged');
        const style = (isTitleValid && isTitleTextChanged) || (!isTitleValid && !isTitleTextChanged) ? styles.titleTextStyle : styles.titleErrorTextStyle;
        return <View style={styles.titleStyle}>
            <Text style={style}>{strings.label_title.toUpperCase()}</Text>
        </View>
    }

    renderDateTitle() {
        const isEndDateValid = this.state.data.get('isEndDateValid');
        const style = (isEndDateValid) ? styles.titleTextStyle : styles.titleErrorTextStyle;
        return <View style={styles.titleStyle}>
            <Text style={style}>{strings.label_date_and_time.toUpperCase()}</Text>
        </View>
    }

    renderDescriptionTitle() {
        const isDescriptionValid = this.state.data.get('isDescriptionValid');
        const isDescriptionTextChanged = this.state.data.get('isDescriptionTextChanged');
        const style = (isDescriptionValid && isDescriptionTextChanged) || (!isDescriptionValid && !isDescriptionTextChanged) ? styles.titleTextStyle : styles.titleErrorTextStyle;
        return <View style={styles.titleStyle}>
            <Text style={style}>{strings.label_description.toUpperCase()}</Text>
        </View>
    }

    renderWhatToBringTitle() {
        const isWhatToBringValid = this.state.data.get('isWhatToBringValid');
        const isWhatToBringTextChanged = this.state.data.get('isWhatToBringTextChanged');
        const style = (isWhatToBringValid && isWhatToBringTextChanged) || (!isWhatToBringValid && !isWhatToBringTextChanged) ? styles.titleTextStyle : styles.titleErrorTextStyle;
        return <View style={styles.titleStyle}>
            <Text style={style}>{strings.label_what_to_bring_with_you.toUpperCase()}</Text>
        </View>
    }

    renderTitleError() {
        const isTitleValid = this.state.data.get('isTitleValid');
        const isTitleTextChanged = this.state.data.get('isTitleTextChanged');
        if (!isTitleValid && isTitleTextChanged) {
            return <Text style={styles.textErrorStyle}>{strings.label_invalid_event_field}</Text>
        } else {
            return null
        }
    }

    renderDateError() {
        const isEndDateValid = this.state.data.get('isEndDateValid');
        if (!isEndDateValid) {
            return <Text style={styles.textErrorStyle}>{strings.label_invalid_event_date}</Text>
        } else {
            return null
        }
    }

    renderDescriptionError() {
        const isDescriptionValid = this.state.data.get('isDescriptionValid');
        const isDescriptionTextChanged = this.state.data.get('isDescriptionTextChanged');
        if (!isDescriptionValid && isDescriptionTextChanged) {
            return <Text style={styles.textErrorStyle}>{strings.label_description}{strings.label_invalid_event_description}</Text>
        } else {
            return null
        }
    }

    renderWhatToBringError() {
        const isWhatToBringValid = this.state.data.get('isWhatToBringValid');
        const isWhatToBringTextChanged = this.state.data.get('isWhatToBringTextChanged');
        if (!isWhatToBringValid && isWhatToBringTextChanged) {
            return <Text style={styles.textErrorStyle}>{strings.label_what_to_bring_with_you}{strings.label_invalid_event_description}</Text>
        } else {
            return null
        }
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
                const startDate = this.state.data.get('startDate');
                const endDate = startDate.split(" ")[0] + " " + date.split(" ")[1];
                this.setData(d => d.set('endDate', endDate))
            }}/>
    }

    render() {
        const isTitleValid = this.state.data.get('isTitleValid');
        const isDescriptionValid = this.state.data.get('isDescriptionValid');
        const isWhatToBringValid = this.state.data.get('isWhatToBringValid');
        const isStartDateValid = this.state.data.get('isStartDateValid');
        const isEndDateValid = this.state.data.get('isEndDateValid');
        const imagePath = this.state.data.get('photos')[0].uri;

        const isValid = isTitleValid && isDescriptionValid && isWhatToBringValid && isStartDateValid && isEndDateValid;

        return (
            <View>
                <ScrollView
                    ref='scrollView'
                    style={styles.container}>

                    {this.renderTitle()}
                    <View style={styles.inputContainerStyle}>
                        <InputField style={styles.inputTextStyle}
                                    placeholder={strings.label_title_hint}
                                    autoCorrect={false}
                                    validate={this.validateTitle}
                                    multiline={true}
                                    maxLength={70}
                                    onChangeText={this.onTitleTextChanged}/>
                    </View>
                    {this.renderTitleError()}
                    {this.renderDateTitle()}
                    <View style={styles.dateContainer}>
                        <View style={styles.imageContainer}>
                            <Image source={require('../../../assets/images/ic_time.png')}
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
                    {this.renderDateError()}
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
                    {
                        (this.state.data.get('selectedLocation') === undefined) ?
                            <View style={styles.trashpointTipStyle}>
                                <Image source={require('../../../assets/images/ic_trashpoints.png')}
                                       style={styles.imageTrashStyle}/>
                                <Text style={styles.textTrashStyle}>{strings.label_tip_add_trashpoints}</Text>
                            </View>
                            :
                            <TouchableOpacity onPress={this.onAddTrashPointsClick.bind(this)}>
                                <View style={styles.locationContainerStyle}>
                                    <Image source={require('../../../assets/images/ic_trashpoints.png')}
                                           style={styles.imageTrashStyle}/>
                                    <Text style={styles.textTrashStyle}>{strings.label_add_trashPoints}</Text>
                                </View>
                            </TouchableOpacity>
                    }
                    {this.renderDescriptionTitle()}
                    <View style={styles.descriptionContainerStyle}>
                        <InputField style={styles.inputTextStyle}
                                    placeholder={strings.label_ignite_people_to_participate}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    multiline={true}
                                    validate={this.validateDescription}
                                    maxLength={500}
                                    onChangeText={this.onDescriptionTextChanged}/>
                    </View>
                    {this.renderDescriptionError()}
                    {this.renderWhatToBringTitle()}
                    <View style={styles.whatBringContainerStyle}>
                        <InputField style={styles.inputTextStyle}
                                    placeholder={strings.label_specify_tools_for_work}
                                    underlineColorAndroid={'transparent'}
                                    autoCorrect={false}
                                    multiline={true}
                                    validate={this.validateWhatToBring}
                                    maxLength={500}
                                    onChangeText={this.onWhatToBringTextChanged}/>
                    </View>
                    {this.renderWhatToBringError()}
                    <View style={styles.titleStyle}>
                        <Text style={styles.titleTextStyle}>{strings.label_cover_photo.toUpperCase()}</Text>
                    </View>
                    <View style={styles.eventPhotoContainerStyle}>
                        <Image style={styles.photoIconStyle} source={{uri: imagePath}}/>
                        <TouchableOpacity onPress={() => this.showChoosedDialog()}>
                            <Image style={styles.addPhotoIconStyle}
                                   source={require('../../../assets/images/ic_add_photo.png')}/>
                        </TouchableOpacity>
                        <Text style={styles.addPhotoTextStyle}>{strings.label_add_photo}</Text>
                    </View>

                    <MainButton
                        isValid={isValid}
                        text={strings.label_next}
                        style={styles.nextButtonStyle}
                        onPress={() => this.onNextClick(isValid)}/>
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
            cropping: true,
            includeBase64: true,
        }).then(async image => {
            console.warn("Base64", image.data);
            const thumbnailBase64 = await ImageService.getResizedImageBase64({
                uri: image.path,
                width,
                height,
            });
            this.setData(d => d.set('photos', [
                { uri: image.path, base64: image.data, thumbnail: { base64: thumbnailBase64 } },
            ],))
        });
    };

    openCamera() {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
            includeBase64: true,
        }).then(image => {
            this.setData(d => d.set('photos', image.path))
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
                location: this.state.data.get('selectedLocation'),
                selectedTrashPoints: this.trashPoints,
                onTrashPointsSelected: this.onTrashPointsSelected.bind(this)
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
        this.setData(d => d.set('selectedLocation', location));
    }

    onTitleTextChanged = (text: String) => {
        this.title = text;
        this.setData(d => d.set('isTitleTextChanged', true))
    };

    onDescriptionTextChanged = (text: String) => {
        this.description = text;
        this.setData(d => d.set('isDescriptionTextChanged', true))
    };

    onWhatToBringTextChanged = (text: String) => {
        this.whatToBring = text;
        this.setData(d => d.set('isWhatToBringTextChanged', true))
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
        const endDateTime = Moment(endTime, "DD-MM-YYYY HH:mm").toDate();
        const startDateFormat = this.state.data.get('startDate');
        const startDate = Moment(startDateFormat, "DD-MM-YYYY HH:mm").toDate();
        let isValid = startDate < endDateTime;
        this.setData(d => d.set('isEndDateValid', isValid))
    };

    onNextClick = (isValid) => {
        if (isValid) {
            this.props.navigator.push({
                screen: ADD_COORDINATOR,
                title: strings.label_create_events_step_two,
                passProps: {
                    event: {
                        datasetId: '26e7668a-fa3f-4ba6-bb0b-e8892ee306аа',
                        name: this.title,
                        address: '456',
                        startTime: this.state.data.get('startDate'),
                        endTime: this.state.data.get('endDate'),
                        location: {
                            latitude: 48.8152937,
                            longitude: 2.4597668,
                        },
                        description: this.description,
                        whatToBring: this.whatToBring,
                        photos: this.state.data.get('photos'),
                    },
                }
            });
        } else {
            this.showValidationErrors()
        }
    };

    showValidationErrors() {
        const isTitleValid = this.state.data.get('isTitleValid');
        if (!isTitleValid) {
            this.setData(d => d.set('isTitleTextChanged', true))
        }
        const isDescriptionValid = this.state.data.get('isDescriptionValid');
        if (!isDescriptionValid) {
            this.setData(d => d.set('isDescriptionTextChanged', true))
        }
        const isWhatToBringValid = this.state.data.get('isWhatToBringValid');
        if (!isWhatToBringValid) {
            this.setData(d => d.set('isWhatToBringTextChanged', true))
        }
        const isStartDateValid = this.state.data.get('isStartDateValid');
        const isEndDateValid = this.state.data.get('isEndDateValid');
        if (!isTitleValid || !isStartDateValid || !isEndDateValid) {
            this.refs.scrollView.scrollTo({x: 0, y: 0, animated: true})
        }

    }
}